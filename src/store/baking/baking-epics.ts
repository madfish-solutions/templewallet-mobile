import { Action } from '@reduxjs/toolkit';
import retry from 'async-retry';
import { combineEpics, Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ofType } from 'ts-action-operators';

import { BakerInterface, bakingBadApi, fetchBaker, buildUnknownBaker } from 'src/apis/baking-bad';
import type { RootState } from 'src/store/types';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { RPC_RETRY_OPTIONS } from 'src/utils/tezos.util';
import { withSelectedAccount, withSelectedRpcUrl } from 'src/utils/wallet.utils';

import { loadBakersListActions, loadSelectedBakerActions } from './baking-actions';

const loadSelectedBakerAddressEpic: Epic<Action, Action, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(loadSelectedBakerActions.submit),
    withSelectedAccount(state$),
    withSelectedRpcUrl(state$),
    switchMap(([[, selectedAccount], rpcUrl]) => {
      const tezos = createReadOnlyTezosToolkit(rpcUrl, selectedAccount);

      return from(retry(() => tezos.rpc.getDelegate(selectedAccount.publicKeyHash), RPC_RETRY_OPTIONS));
    }),
    switchMap(bakerAddress =>
      bakerAddress
        ? from(fetchBaker(bakerAddress)).pipe(map(baker => baker || buildUnknownBaker(bakerAddress)))
        : of(null)
    ),
    map(baker => loadSelectedBakerActions.success(baker)),
    catchError(error => {
      console.error(error);

      return of(loadSelectedBakerActions.fail(error.message));
    })
  );

const loadBakersListEpic: Epic = action$ =>
  action$.pipe(
    ofType(loadBakersListActions.submit),
    switchMap(() =>
      from(
        bakingBadApi.get<BakerInterface[]>('/bakers', {
          params: {
            status: 'active',
            delegation: true
          }
        })
      ).pipe(
        map(({ data }) => loadBakersListActions.success(data)),
        catchError(error => {
          console.error(error);

          return of(loadBakersListActions.fail(error.message));
        })
      )
    )
  );

export const bakingEpics = combineEpics(loadSelectedBakerAddressEpic, loadBakersListEpic);
