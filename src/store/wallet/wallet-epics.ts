import { combineEpics } from 'redux-observable';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { api } from '../../api.service';
import { GetAccountTokenBalancesResponseInterface } from '../../interfaces/get-account-token-balances-response.interface';
import { XTZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { currentNetworkId$, tezos$ } from '../../utils/network/network.util';
import { mutezToTz } from '../../utils/tezos.util';
import { loadTezosBalanceActions, loadTokenBalancesActions } from './wallet-actions';

const loadTokenAssetsEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadTokenBalancesActions.submit),
    toPayload(),
    withLatestFrom(currentNetworkId$),
    switchMap(([address, currentNetworkId]) =>
      from(
        api.get<GetAccountTokenBalancesResponseInterface>(`/account/${currentNetworkId}/${address}/token_balances`, {
          params: { size: 10, offset: 0 }
        })
      ).pipe(
        map(({ data }) => loadTokenBalancesActions.success(data.balances)),
        catchError(err => of(loadTokenBalancesActions.fail(err.message)))
      )
    )
  );

const loadTezosAssetsEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadTezosBalanceActions.submit),
    toPayload(),
    withLatestFrom(tezos$),
    switchMap(([address, tezos]) =>
      from(tezos.tz.getBalance(address)).pipe(
        map(balance => loadTezosBalanceActions.success(mutezToTz(balance, XTZ_TOKEN_METADATA.decimals).toString())),
        catchError(err => of(loadTezosBalanceActions.fail(err.message)))
      )
    )
  );

export const walletEpics = combineEpics(loadTezosAssetsEpic, loadTokenAssetsEpic);
