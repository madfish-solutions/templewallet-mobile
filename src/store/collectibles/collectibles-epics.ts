import { Epic, combineEpics } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ofType, toPayload } from 'ts-action-operators';

import { loadAllCollectiblesDetails$ } from 'src/utils/collectibles.utils';

import { loadCollectiblesDetailsActions } from './collectibles-actions';

const loadCollectiblesDetailsEpic: Epic = action$ =>
  action$.pipe(
    ofType(loadCollectiblesDetailsActions.submit),
    toPayload(),
    switchMap(collectiblesSlugs =>
      loadAllCollectiblesDetails$(collectiblesSlugs).pipe(
        map(collectiblesDetails => loadCollectiblesDetailsActions.success(collectiblesDetails)),
        catchError(err => {
          console.log(err);

          return of(loadCollectiblesDetailsActions.fail(err.message));
        })
      )
    )
  );

export const collectiblesEpics = combineEpics(loadCollectiblesDetailsEpic);
