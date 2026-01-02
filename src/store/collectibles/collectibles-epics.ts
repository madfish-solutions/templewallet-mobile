import { combineEpics } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ofType, toPayload } from 'ts-action-operators';

import { fetchObjktCollectiblesBySlugs$ } from 'src/apis/objkt';
import { ObjktCollectibleDetails } from 'src/apis/objkt/types';
import { CollectibleDetailsInterface } from 'src/token/interfaces/collectible-interfaces.interface';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { sendErrorAnalyticsEvent } from 'src/utils/analytics/analytics.util';
import { withUserAnalyticsCredentials } from 'src/utils/error-analytics-data.utils';

import { AnyActionEpic } from '../types';

import { loadCollectiblesDetailsActions } from './collectibles-actions';
import { CollectibleDetailsRecord } from './collectibles-state';
import { convertCollectibleObjktInfoToStateDetailsType } from './utils';

const loadCollectiblesDetailsEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadCollectiblesDetailsActions.submit),
    toPayload(),
    withUserAnalyticsCredentials(state$),
    switchMap(([collectiblesSlugs, { userId, ABTestingCategory, isAnalyticsEnabled }]) => {
      let fetchedCollectiblesDetails: ObjktCollectibleDetails[] | undefined;

      return fetchObjktCollectiblesBySlugs$(collectiblesSlugs).pipe(
        map(collectiblesDetails => {
          fetchedCollectiblesDetails = collectiblesDetails;

          const entries: [string, CollectibleDetailsInterface | null][] = collectiblesDetails.map(info => {
            const slug = toTokenSlug(info.fa_contract, info.token_id);
            const details = convertCollectibleObjktInfoToStateDetailsType(info);

            return [slug, details];
          });

          for (const collectiblesSlug of collectiblesSlugs) {
            if (!entries.some(([slug]) => slug === collectiblesSlug)) {
              entries.push([collectiblesSlug, null]);
            }
          }

          const details: CollectibleDetailsRecord = Object.fromEntries(entries);

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
  );

export const collectiblesEpics = combineEpics(loadCollectiblesDetailsEpic);
