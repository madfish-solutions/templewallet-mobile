import { combineEpics } from 'redux-observable';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { fetchCollectibleDetails$ } from 'src/apis/objkt';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { loadAllCollectiblesDetails$ } from 'src/utils/collectibles.utils';

import { loadCollectiblesDetailsActions, loadCollectibleDetailsActions } from './collectibles-actions';

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

export const collectiblesEpics = combineEpics(loadCollectiblesDetailsEpic, loadCollectibleDetailsEpic);
