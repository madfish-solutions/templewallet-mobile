import { combineEpics, Epic } from 'redux-observable';
import { map, switchMap } from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { fetchCollections$ } from 'src/apis/objkt';

import { loadCollectionsActions } from './collections-actions';

const getCollectionsInfoEpic: Epic = action$ =>
  action$.pipe(
    ofType(loadCollectionsActions.submit),
    toPayload(),
    switchMap(accountPkh => fetchCollections$(accountPkh).pipe(map(result => loadCollectionsActions.success(result))))
  );

export const collectionsEpics = combineEpics(getCollectionsInfoEpic);
