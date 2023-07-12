import { combineEpics, Epic } from 'redux-observable';
import { catchError, forkJoin, from, map, merge, mergeMap, Observable, of, switchMap } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { getV3FarmsList } from 'src/apis/quipuswap-staking';
import { showErrorToast, showErrorToastByError } from 'src/toast/error-toast.utils';
import { getAxiosQueryErrorMessage } from 'src/utils/get-axios-query-error-message';
import { isDefined } from 'src/utils/is-defined';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { withSelectedAccount, withSelectedRpcUrl } from 'src/utils/wallet.utils';

import type { RootState } from '../types';
import {
  loadAllFarmsActions,
  loadAllFarmsAndStakesAction,
  loadAllStakesActions,
  loadSingleFarmStakeActions
} from './actions';
import { UserStakeValueInterface } from './state';
import { getFarmStake, GetFarmStakeError, RawStakeValue, toUserStakeValueInterface } from './utils';

const loadSingleFarmLastStake: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadSingleFarmStakeActions.submit),
    withSelectedAccount(state$),
    withSelectedRpcUrl(state$),
    switchMap(([[{ payload: farm }, selectedAccount], rpcUrl]) => {
      const tezos = createReadOnlyTezosToolkit(rpcUrl, selectedAccount);

      return from(getFarmStake(farm, tezos, selectedAccount.publicKeyHash)).pipe(
        map(stake =>
          loadSingleFarmStakeActions.success({
            stake: isDefined(stake) ? toUserStakeValueInterface(stake, farm.vestingPeriodSeconds) : undefined,
            farmAddress: farm.contractAddress
          })
        ),
        catchError(err => {
          throw new GetFarmStakeError(farm.contractAddress, (err as Error).message);
        })
      );
    }),
    catchError(err => {
      const { farmAddress } = err as GetFarmStakeError;
      showErrorToastByError(err);

      return of(loadSingleFarmStakeActions.fail({ farmAddress, error: (err as Error).message }));
    })
  );

const loadAllFarms: Epic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadAllFarmsActions.submit),
    switchMap(() =>
      from(getV3FarmsList()).pipe(
        map(farms => loadAllFarmsActions.success(farms)),
        catchError(err => {
          showErrorToast({ description: getAxiosQueryErrorMessage(err) });

          return of(loadAllFarmsActions.fail());
        })
      )
    )
  );

const loadAllFarmsAndLastStake: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadAllFarmsAndStakesAction),
    switchMap(() =>
      from(getV3FarmsList()).pipe(
        withSelectedAccount(state$),
        withSelectedRpcUrl(state$),
        switchMap(([[farms, selectedAccount], rpcUrl]) => {
          const tezos = createReadOnlyTezosToolkit(rpcUrl, selectedAccount);

          return forkJoin(
            farms.map(async ({ item: farm }) =>
              getFarmStake(farm, tezos, selectedAccount.publicKeyHash)
                .then((stake): [string, RawStakeValue | null] => [farm.contractAddress, stake])
                .catch((e): [string, undefined] => {
                  showErrorToastByError(e);
                  console.error('Error while loading farm stakes: ', farm.contractAddress);

                  return [farm.contractAddress, undefined];
                })
            )
          ).pipe(
            map(stakesEntries =>
              Object.fromEntries(
                stakesEntries.map(([farmAddress, stake]): [string, UserStakeValueInterface | null | undefined] => {
                  const farm = farms.find(({ item }) => item.contractAddress === farmAddress);

                  return [
                    farmAddress,
                    stake && toUserStakeValueInterface(stake, farm?.item.vestingPeriodSeconds ?? '0')
                  ];
                })
              )
            ),
            mergeMap(stakes => merge(of(loadAllFarmsActions.success(farms)), of(loadAllStakesActions.success(stakes))))
          );
        })
      )
    ),
    catchError(err => {
      showErrorToast({ description: getAxiosQueryErrorMessage(err) });

      return of(loadAllFarmsActions.fail());
    })
  );

export const farmsEpics = combineEpics(loadSingleFarmLastStake, loadAllFarms, loadAllFarmsAndLastStake);
