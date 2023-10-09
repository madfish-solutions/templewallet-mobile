import { Epic, combineEpics } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ofType, toPayload } from 'ts-action-operators';

import { fetchObjktCollectiblesBySlugs$ } from 'src/apis/objkt';
import { CollectibleDetailsInterface } from 'src/token/interfaces/collectible-interfaces.interface';
import { toTokenSlug } from 'src/token/utils/token.utils';

import { loadCollectiblesDetailsActions } from './collectibles-actions';
import { CollectibleDetailsRecord } from './collectibles-state';
import { convertCollectibleObjktInfoToStateDetailsType } from './utils';

const loadCollectiblesDetailsEpic: Epic = action$ =>
  action$.pipe(
    ofType(loadCollectiblesDetailsActions.submit),
    toPayload(),
    switchMap(collectiblesSlugs =>
      fetchObjktCollectiblesBySlugs$(collectiblesSlugs).pipe(
        map(collectiblesDetails => {
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

          return loadCollectiblesDetailsActions.success(details);
        }),
        catchError(err => {
          console.error(err);

          return of(loadCollectiblesDetailsActions.fail(err.message));
        })
      )
    )
  );

export const collectiblesEpics = combineEpics(loadCollectiblesDetailsEpic);
