import { combineEpics, Epic } from 'redux-observable';
import { catchError, forkJoin, from, map, merge, mergeMap, Observable, of, switchMap } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { getSingleV3Farm, getV3FarmsList } from 'src/apis/quipuswap-staking';
import { FarmVersionEnum, NetworkEnum } from 'src/apis/quipuswap-staking/types';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { getAxiosQueryErrorMessage } from 'src/utils/get-axios-query-error-message';
import { isDefined } from 'src/utils/is-defined';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { withSelectedAccount, withSelectedRpcUrl } from 'src/utils/wallet.utils';

import { RootState } from '../create-store';
import { loadAllFarmsActions, loadAllStakesActions, loadSingleFarmActions } from './actions';
import { UserStakeValueInterface } from './state';
import { getFarmStake } from './utils';

const loadSingleFarm = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadSingleFarmActions.submit),
    switchMap(({ payload: { id, version } }) => {
      if (version === FarmVersionEnum.V3) {
        return from(getSingleV3Farm(NetworkEnum.Mainnet, id)).pipe(
          map(response => loadSingleFarmActions.success(response))
        );
      }

      throw new Error(`Farm version ${version} is not supported yet`);
    }),
    catchError(err => {
      showErrorToast({ description: getAxiosQueryErrorMessage(err) });

      return of(loadSingleFarmActions.fail());
    })
  );

const loadAllFarmsAndLastStake: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadAllFarmsActions.submit),
    switchMap(() =>
      from(getV3FarmsList(NetworkEnum.Mainnet)).pipe(
        withSelectedAccount(state$),
        withSelectedRpcUrl(state$),
        switchMap(([[farms, selectedAccount], rpcUrl]) => {
          const tezos = createReadOnlyTezosToolkit(rpcUrl, selectedAccount);

          return forkJoin(
            farms.map(async ({ item: farm }) =>
              getFarmStake(farm, tezos, selectedAccount.publicKeyHash)
                .then((stake): [string, UserStakeValueInterface | undefined] => [farm.contractAddress, stake])
                .catch((): [string, undefined] => {
                  console.error('Error while loading farm stakes: ', farm.contractAddress);

                  return [farm.contractAddress, undefined];
                })
            )
          ).pipe(
            map(stakesEntries =>
              Object.fromEntries(
                stakesEntries.filter((entry): entry is [string, UserStakeValueInterface] => isDefined(entry[1]))
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

export const farmsEpics = combineEpics(loadSingleFarm, loadAllFarmsAndLastStake);
