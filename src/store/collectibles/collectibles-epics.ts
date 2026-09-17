import { combineEpics } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, concatMap, distinctUntilChanged, map, mergeMap, switchMap } from 'rxjs/operators';
import { ofType, toPayload } from 'ts-action-operators';

import { fetchObjktCollectiblesBySlugs$, ObjktCollectiblesBySlugsError } from 'src/apis/objkt';
import { sendErrorAnalyticsEvent } from 'src/utils/analytics/analytics.util';
import { withUserAnalyticsCredentials } from 'src/utils/error-analytics-data.utils';

import { AnyActionEpic } from '../types';

import { loadCollectiblesDetailsActions, loadOneCollectibleDetailsActions } from './collectibles-actions';
import { collectiblesDetailsRecordFromObjktBatch, convertCollectibleObjktInfoToStateDetailsType } from './utils';

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
          if (collectiblesSlugs.length === 0) {
            return of(loadCollectiblesDetailsActions.success({ details: {}, timestamp: Date.now() }));
          }

          return fetchObjktCollectiblesBySlugs$(collectiblesSlugs).pipe(
            mergeMap(batch => {
              const actions = [];
              const details = collectiblesDetailsRecordFromObjktBatch(batch.tokens, batch.missingSlugs);

              if (Object.keys(details).length > 0) {
                actions.push(loadCollectiblesDetailsActions.success({ details, timestamp: Date.now() }));
              }

              if (batch.failedSlugs.length > 0) {
                const error = batch.error ?? new ObjktCollectiblesBySlugsError(batch.failedSlugs);

                actions.push(loadCollectiblesDetailsActions.fail({ slugs: batch.failedSlugs, error: error.message }));
              }

              return from(actions);
            }),
            catchError(err => {
              const error = err instanceof Error ? err : new Error(String(err));
              const slugs = err instanceof ObjktCollectiblesBySlugsError ? err.slugs : collectiblesSlugs;

              if (isAnalyticsEnabled) {
                sendErrorAnalyticsEvent(
                  'LoadCollectiblesDetailsEpicError',
                  error,
                  [],
                  { userId, ABTestingCategory },
                  { collectiblesSlugs: slugs }
                );
              }

              return of(loadCollectiblesDetailsActions.fail({ slugs, error: error.message }));
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
    switchMap(([slug, { userId, ABTestingCategory, isAnalyticsEnabled }]) =>
      fetchObjktCollectiblesBySlugs$([slug]).pipe(
        mergeMap(batch => {
          if (batch.failedSlugs.length > 0) {
            const error = batch.error ?? new ObjktCollectiblesBySlugsError(batch.failedSlugs);

            if (isAnalyticsEnabled) {
              sendErrorAnalyticsEvent(
                'LoadOneCollectibleDetailsEpicError',
                error,
                [],
                { userId, ABTestingCategory },
                { slug }
              );
            }

            return of(loadOneCollectibleDetailsActions.fail(error.message));
          }

          const token = batch.tokens[0];

          return of(
            loadOneCollectibleDetailsActions.success({
              slug,
              details: token ? convertCollectibleObjktInfoToStateDetailsType(token) : null,
              timestamp: Date.now()
            })
          );
        }),
        catchError(err => {
          const error = err instanceof Error ? err : new Error(String(err));

          if (isAnalyticsEnabled) {
            sendErrorAnalyticsEvent(
              'LoadOneCollectibleDetailsEpicError',
              error,
              [],
              { userId, ABTestingCategory },
              { slug }
            );
          }

          return of(loadOneCollectibleDetailsActions.fail(error.message));
        })
      )
    )
  );

export const collectiblesEpics = combineEpics(loadCollectiblesDetailsEpic, loadOneCollectibleDetailsEpic);
