import { combineEpics } from 'redux-observable';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { getAssetsRequest$, getTezosBalanceRequest$ } from '../../api.service';
import { loadTezosAssetsActions, loadTokenAssetsActions } from './assets-actions';

const loadTokenAssetsEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadTokenAssetsActions.submit),
    toPayload(),
    getAssetsRequest$(),
    map(response => loadTokenAssetsActions.success(response.data.balances)),
    catchError(err => of(loadTokenAssetsActions.fail(err.response.data.message)))
  );

const loadTezosAssetsEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadTezosAssetsActions.submit),
    toPayload(),
    getTezosBalanceRequest$(),
    map(response => loadTezosAssetsActions.success(response.toString())),
    catchError(err => of(loadTezosAssetsActions.fail(err.response.data.message)))
  );

export const assetsEpics = combineEpics(loadTezosAssetsEpic, loadTokenAssetsEpic);
