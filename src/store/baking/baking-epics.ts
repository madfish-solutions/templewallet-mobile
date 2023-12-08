import { Action } from '@reduxjs/toolkit';
import retry from 'async-retry';
import { combineEpics, Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ofType } from 'ts-action-operators';

import { getTzktApi } from 'src/api.service';
import { BakerInterface, bakingBadApi, fetchBaker, buildUnknownBaker } from 'src/apis/baking-bad';
import { BakerRewardInterface } from 'src/interfaces/baker-reward.interface';
import type { RootState } from 'src/store/types';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { RPC_RETRY_OPTIONS } from 'src/utils/tezos.util';
import { withSelectedAccount, withSelectedRpcUrl } from 'src/utils/wallet.utils';

import { loadBakerRewardsListActions, loadBakersListActions, loadSelectedBakerActions } from './baking-actions';

const NUMBER_OF_BAKER_REWARDS_TO_LOAD = 30;

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
            configs: true,
            insurance: true,
            contribution: true,
            type: 'tezos_only,multiasset,tezos_dune'
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

const loadBakerRewardsListEpic: Epic<Action, Action, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(loadBakerRewardsListActions.submit),
    withSelectedAccount(state$),
    withSelectedRpcUrl(state$),
    switchMap(([[, selectedAccount], selectedRpcUrl]) =>
      from(
        getTzktApi(selectedRpcUrl).get<BakerRewardInterface[]>(`/rewards/delegators/${selectedAccount.publicKeyHash}`, {
          params: { limit: NUMBER_OF_BAKER_REWARDS_TO_LOAD }
        })
      ).pipe(
        map(({ data }) => loadBakerRewardsListActions.success(data)),
        catchError(err => of(loadBakerRewardsListActions.fail(err.message)))
      )
    )
  );

export const bakingEpics = combineEpics(loadSelectedBakerAddressEpic, loadBakersListEpic, loadBakerRewardsListEpic);
