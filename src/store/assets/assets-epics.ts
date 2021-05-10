import { combineEpics } from 'redux-observable';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { getAccountTokenBalancesRequest$, getTezosBalanceRequest$ } from '../../api.service';
import { loadTezosAssetsActions, loadTokenAssetsActions } from './assets-actions';

const loadTokenAssetsEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadTokenAssetsActions.submit),
    toPayload(),
    getAccountTokenBalancesRequest$(),
    map(({ data }) => loadTokenAssetsActions.success(data.balances)),
    catchError(err => of(loadTokenAssetsActions.fail(err.response.data.message)))
  );

const loadTezosAssetsEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadTezosAssetsActions.submit),
    toPayload(),
    getTezosBalanceRequest$(),
    map(balance => loadTezosAssetsActions.success(balance.toString())),
    catchError(err => of(loadTezosAssetsActions.fail(err.response.data.message)))
  );

export const assetsEpics = combineEpics(loadTezosAssetsEpic, loadTokenAssetsEpic);
