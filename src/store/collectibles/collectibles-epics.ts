import { combineEpics } from 'redux-observable';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { fetchCollectibleDetails$, fetchCollectibleFloorPrice$ } from '../../apis/objkt';
import { getTokenSlug } from '../../token/utils/token.utils';
import { loadAllCollectiblesDetails$, withAllCollectiblesDetails } from '../../utils/collectibles.utils';
import { RootState } from '../create-store';
import {
  updateCollectibleDetailsAction,
  loadCollectiblesDetailsActions,
  loadCollectibleDetailsActions
} from './collectibles-actions';

const loadCollectiblesDetailsEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadCollectiblesDetailsActions.submit),
    toPayload(),
    switchMap(collectiblesSlugs =>
      loadAllCollectiblesDetails$(collectiblesSlugs).pipe(
        map(collectiblesDetails => loadCollectiblesDetailsActions.success(collectiblesDetails)),
        catchError(err => of(loadCollectiblesDetailsActions.fail(err.message)))
      )
    )
  );

const loadCollectibleDetailsEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadCollectibleDetailsActions.submit),
    toPayload(),
    switchMap(({ address, id }) =>
      fetchCollectibleDetails$(address, id).pipe(
        map(collectibleDetails => {
          const slug = getTokenSlug({ address, id });

          return loadCollectibleDetailsActions.success({ [slug]: collectibleDetails });
        }),
        catchError(err => of(loadCollectibleDetailsActions.fail(err.message)))
      )
    )
  );

const loadCollectibleFloorPriceEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(updateCollectibleDetailsAction.submit),
    toPayload(),
    withAllCollectiblesDetails(state$),
    switchMap(([payload, allCollectiblesDetails]) =>
      fetchCollectibleFloorPrice$(payload.address, payload.id).pipe(
        map(listingsActive => {
          const slug = getTokenSlug({ address: payload.address, id: payload.id });

          const collectibleDetails = {
            [slug]: {
              ...allCollectiblesDetails[slug],
              listingsActive
            }
          };

          return updateCollectibleDetailsAction.success(collectibleDetails);
        }),
        catchError(err => of(updateCollectibleDetailsAction.fail(err.message)))
      )
    )
  );

export const collectiblesEpics = combineEpics(
  loadCollectiblesDetailsEpic,
  loadCollectibleDetailsEpic,
  loadCollectibleFloorPriceEpic
);
