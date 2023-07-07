import { combineEpics } from 'redux-observable';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { fetchCollectibleFloorPrice$ } from '../../apis/objkt';
import { loadAllCollectiblesDetails$ } from '../../utils/collectibles.utils';
import { updateCollectibleDetailsAction, loadCollectiblesDetailsActions } from './collectibles-actions';

const loadCollectiblesDetailsEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadCollectiblesDetailsActions.submit),
    toPayload(),
    switchMap(account =>
      loadAllCollectiblesDetails$(account).pipe(
        map(collectiblesDetails => loadCollectiblesDetailsActions.success(collectiblesDetails)),
        catchError(err => of(loadCollectiblesDetailsActions.fail(err.message)))
      )
    )
  );

const loadCollectibleFloorPriceEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(updateCollectibleDetailsAction.submit),
    toPayload(),
    switchMap(collectible =>
      fetchCollectibleFloorPrice$(collectible.address, collectible.id.toString()).pipe(
        map(listingsActive =>
          updateCollectibleDetailsAction.success(JSON.stringify({ ...collectible, listingsActive }))
        ),
        catchError(err => of(updateCollectibleDetailsAction.fail(err.message)))
      )
    )
  );

export const collectiblesEpics = combineEpics(loadCollectiblesDetailsEpic, loadCollectibleFloorPriceEpic);
