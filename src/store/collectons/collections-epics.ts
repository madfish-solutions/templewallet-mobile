import { combineEpics, Epic } from 'redux-observable';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { fetchCollectionsLogo$ } from 'src/apis/objkt';

import { loadCollectionsActions } from './collections-actions';

const getCollectionsInfoEpic: Epic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadCollectionsActions.submit),
    toPayload(),
    switchMap(collectionAddresses =>
      forkJoin(collectionAddresses.map(address => fetchCollectionsLogo$(address))).pipe(
        map(result => loadCollectionsActions.success(result))
      )
    )
  );

export const collectionsEpics = combineEpics(getCollectionsInfoEpic);
