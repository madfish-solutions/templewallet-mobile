import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { getAssetsRequest$ } from '../../api.service';
import { loadAssetsActions } from './assets-actions';

export const loadAssetsEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadAssetsActions.submit),
    toPayload(),
    switchMap(payload =>
      getAssetsRequest$(payload).pipe(
        map(response => loadAssetsActions.success(response.data.balances)),
        catchError(err => of(loadAssetsActions.fail(err.response.data.message)))
      )
    )
  );
