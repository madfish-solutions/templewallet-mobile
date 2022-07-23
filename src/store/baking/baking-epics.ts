import { combineEpics, Epic } from 'redux-observable';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { bakingBadApi, tzktApi } from '../../api.service';
import { BakerRewardInterface } from '../../interfaces/baker-reward.interface';
import { BakerInterface, emptyBaker } from '../../interfaces/baker.interface';
import { isDefined } from '../../utils/is-defined';
import { createReadOnlyTezosToolkit } from '../../utils/rpc/tezos-toolkit.utils';
import { withSelectedAccount, withSelectedRpcUrl } from '../../utils/wallet.utils';
import { RootState } from '../create-store';
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
          if (isDefined(bakerAddress)) {
            return from(bakingBadApi.get<BakerInterface>(`/bakers/${bakerAddress}`)).pipe(map(({ data }) => data));
          } else {
            return of(emptyBaker);
          }
        }),
        map(baker => loadSelectedBakerActions.success(baker)),
        catchError(err => of(loadSelectedBakerActions.fail(err.message)))
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
            type: 'tezos_only,multiasset,tezos_dune',
            health: 'active'
          }
        })
      ).pipe(
        map(({ data }) => loadBakersListActions.success(data)),
        catchError(err => of(loadBakersListActions.fail(err.message)))
      )
    )
  );

const loadBakerRewardsListEpic: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadBakerRewardsListActions.submit),
    withSelectedAccount(state$),
    switchMap(([, selectedAccount]) =>
      from(
        tzktApi.get<BakerRewardInterface[]>(`/rewards/delegators/${selectedAccount.publicKeyHash}`, {
          params: { limit: NUMBER_OF_BAKER_REWARDS_TO_LOAD }
        })
      ).pipe(
        map(({ data }) => loadBakerRewardsListActions.success(data)),
        catchError(err => of(loadBakerRewardsListActions.fail(err.message)))
      )
    )
  );

export const bakingEpics = combineEpics(loadSelectedBakerAddressEpic, loadBakersListEpic, loadBakerRewardsListEpic);
