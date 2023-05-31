import { combineEpics, Epic } from 'redux-observable';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { getTzktApi } from 'src/api.service';
import { BakerInterface, bakingBadApi, fetchBaker, emptyBaker, buildUnknownBaker } from 'src/apis/baking-bad';
import { BakerRewardInterface } from 'src/interfaces/baker-reward.interface';
import type { RootState } from 'src/store/types';
import { isTruthy } from 'src/utils/is-truthy';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { withSelectedAccount, withSelectedRpcUrl } from 'src/utils/wallet.utils';

import { loadBakerRewardsListActions, loadBakersListActions, loadSelectedBakerActions } from './baking-actions';

const NUMBER_OF_BAKER_REWARDS_TO_LOAD = 30;

const loadSelectedBakerAddressEpic: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadSelectedBakerActions.submit),
    withSelectedAccount(state$),
    withSelectedRpcUrl(state$),
    switchMap(([[, selectedAccount], rpcUrl]) =>
      from(createReadOnlyTezosToolkit(rpcUrl, selectedAccount).rpc.getDelegate(selectedAccount.publicKeyHash)).pipe(
        switchMap(bakerAddress => {
          if (!isTruthy(bakerAddress)) {
            return of(emptyBaker);
          }

          return from(fetchBaker(bakerAddress)).pipe(map(baker => baker || buildUnknownBaker(bakerAddress)));
        }),
        map(baker => loadSelectedBakerActions.success(baker)),
        catchError(error => {
          console.error(error);

          return of(loadSelectedBakerActions.fail(error.message));
        })
      )
    )
  );

const loadBakersListEpic: Epic = (action$: Observable<Action>) =>
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

const loadBakerRewardsListEpic: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
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
