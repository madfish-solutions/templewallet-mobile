import { combineEpics } from 'redux-observable';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { getAssetsRequest$, getTezosBalanceRequest$ } from '../../api.service';
import { loadTezosAssetsActions, loadTokenAssetsActions } from './assets-actions';

const loadTokenAssetsEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadTokenAssetsActions.submit),
    toPayload(),
    switchMap(payload =>
      getAssetsRequest$(payload).pipe(
        map(response => loadTokenAssetsActions.success(response.data.balances)),
        catchError(err => of(loadTokenAssetsActions.fail(err.response.data.message)))
      )
    )
  );

const loadTezosAssetsEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadTezosAssetsActions.submit),
    toPayload(),
    switchMap(payload =>
      getTezosBalanceRequest$(payload).pipe(
        // @ts-ignore
        map(response => loadTezosAssetsActions.success(response.toString())),
        catchError(err => of(loadTezosAssetsActions.fail(err.response.data.message)))
      )
    )
  );

export const assetsEpics = combineEpics(loadTezosAssetsEpic, loadTokenAssetsEpic);
