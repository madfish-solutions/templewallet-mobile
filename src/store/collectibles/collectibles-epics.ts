import { combineEpics } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, concatMap, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { ofType, toPayload } from 'ts-action-operators';

import { fetchObjktCollectiblesBySlugs$ } from 'src/apis/objkt';
import { ObjktCollectibleDetails } from 'src/apis/objkt/types';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { sendErrorAnalyticsEvent } from 'src/utils/analytics/analytics.util';
import { withUserAnalyticsCredentials } from 'src/utils/error-analytics-data.utils';

import { AnyActionEpic } from '../types';

import { loadCollectiblesDetailsActions, loadOneCollectibleDetailsActions } from './collectibles-actions';
import { CollectibleDetailsRecord } from './collectibles-state';
import { convertCollectibleObjktInfoToStateDetailsType } from './utils';

/**
 * `concatMap` keeps same-account slug deltas (new NFTs) instead of cancelling in-flight work.
 * `switchMap` on the selected account drops that queue and aborts HTTP when the user switches.
 */
const loadCollectiblesDetailsEpic: AnyActionEpic = (action$, state$) =>
  state$.pipe(
    map(state => state.wallet.selectedAccountPublicKeyHash),
    distinctUntilChanged(),
    switchMap(() =>
      action$.pipe(
        ofType(loadCollectiblesDetailsActions.submit),
        toPayload(),
        withUserAnalyticsCredentials(state$),
        concatMap(([collectiblesSlugs, { userId, ABTestingCategory, isAnalyticsEnabled }]) => {
          let fetchedCollectiblesDetails: ObjktCollectibleDetails[] | undefined;

          return fetchObjktCollectiblesBySlugs$(collectiblesSlugs).pipe(
            map(collectiblesDetails => {
              fetchedCollectiblesDetails = collectiblesDetails;

              const details: CollectibleDetailsRecord = Object.fromEntries(
                collectiblesDetails.map(info => {
                  const slug = toTokenSlug(info.fa_contract, info.token_id);
                  const details = convertCollectibleObjktInfoToStateDetailsType(info);

                  return [slug, details];
                })
              );

              for (const collectiblesSlug of collectiblesSlugs) {
                if (!details[collectiblesSlug]) {
                  details[collectiblesSlug] = null;
                }
              }

              return loadCollectiblesDetailsActions.success({ details, timestamp: Date.now() });
            }),
            catchError(err => {
              console.error(err);

              if (isAnalyticsEnabled) {
                sendErrorAnalyticsEvent(
                  'LoadCollectiblesDetailsEpicError',
                  err,
                  [],
                  { userId, ABTestingCategory },
                  { collectiblesSlugs, fetchedCollectiblesDetails }
                );
              }

              return of(loadCollectiblesDetailsActions.fail(err.message));
            })
          );
        })
      )
    )
  );

const loadOneCollectibleDetailsEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadOneCollectibleDetailsActions.submit),
    toPayload(),
    withUserAnalyticsCredentials(state$),
    switchMap(([slug, { userId, ABTestingCategory, isAnalyticsEnabled }]) => {
      let fetchedCollectibleDetails: ObjktCollectibleDetails | undefined;

      return fetchObjktCollectiblesBySlugs$([slug]).pipe(
        map(([collectibleDetails]) =>
          loadOneCollectibleDetailsActions.success({
            slug: toTokenSlug(collectibleDetails.fa_contract, collectibleDetails.token_id),
            details: convertCollectibleObjktInfoToStateDetailsType(collectibleDetails),
            timestamp: Date.now()
          })
        ),
        catchError(err => {
          console.error(err);

          if (isAnalyticsEnabled) {
            sendErrorAnalyticsEvent(
              'LoadOneCollectibleDetailsEpicError',
              err,
              [],
              { userId, ABTestingCategory },
              { slug, fetchedCollectibleDetails }
            );
          }

          return of(loadOneCollectibleDetailsActions.fail(err.message));
        })
      );
    })
  );

export const collectiblesEpics = combineEpics(loadCollectiblesDetailsEpic, loadOneCollectibleDetailsEpic);
