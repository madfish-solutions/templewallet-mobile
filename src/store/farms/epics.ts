import { combineEpics, Epic } from 'redux-observable';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { getSingleV3Farm, getV3FarmsList } from 'src/apis/quipuswap';
import { FarmVersionEnum } from 'src/apis/quipuswap/types';
import { showErrorToast, showErrorToastByError } from 'src/toast/error-toast.utils';
import { getAxiosQueryErrorMessage } from 'src/utils/get-axios-query-error-message';
import { isDefined } from 'src/utils/is-defined';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { withSelectedAccount, withSelectedRpcUrl } from 'src/utils/wallet.utils';

import { RootState } from '../create-store';
import {
  loadAllFarmsActions,
  loadAllStakesActions,
  loadSingleFarmActions,
  loadSingleFarmStakeActions
} from './actions';
import { LastUserStakeInterface } from './state';
import { getFarmStake, GetFarmStakeError } from './utils';

const loadSingleFarm: Epic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadSingleFarmActions.submit),
    switchMap(({ payload }) => {
      const { id, version } = payload;

      if (version === FarmVersionEnum.V3) {
        return from(getSingleV3Farm(id)).pipe(map(response => loadSingleFarmActions.success(response)));
      }

      throw new Error(`Farm version ${version} is not supported yet`);
    }),
    catchError(err => {
      showErrorToast({ description: getAxiosQueryErrorMessage(err) });

      return of(loadSingleFarmActions.fail());
    })
  );

const loadSingleFarmBalances: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadSingleFarmStakeActions.submit),
    withSelectedAccount(state$),
    withSelectedRpcUrl(state$),
    switchMap(([[{ payload: farm }, selectedAccount], rpcUrl]) => {
      const tezos = createReadOnlyTezosToolkit(rpcUrl, selectedAccount);

      return from(getFarmStake(farm, tezos, selectedAccount.publicKeyHash)).pipe(
        map(stake => loadSingleFarmStakeActions.success({ stake, farmAddress: farm.contractAddress })),
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

const loadAllFarmsAndLastStake: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadAllFarmsActions.submit),
    switchMap(() =>
      from(getV3FarmsList()).pipe(
        map(response => loadAllFarmsActions.success(response)),
        withSelectedAccount(state$),
        withSelectedRpcUrl(state$),
        switchMap(async ([[farms, selectedAccount], rpcUrl]) => {
          const tezos = createReadOnlyTezosToolkit(rpcUrl, selectedAccount);

          const result: LastUserStakeInterface = {};

          for (const { item: farm } of farms.payload) {
            try {
              const newStake = await getFarmStake(farm, tezos, selectedAccount.publicKeyHash);
              if (isDefined(newStake)) {
                result[farm.contractAddress] = newStake;
              }
            } catch (error) {
              console.error('Error while loading farm stakes: ', farm.contractAddress);
            }
          }

          return loadAllStakesActions.success(result);
        })
      )
    ),
    catchError(err => {
      showErrorToast({ description: getAxiosQueryErrorMessage(err) });

      return of(loadAllFarmsActions.fail());
    })
  );

export const farmsEpics = combineEpics(loadSingleFarm, loadSingleFarmBalances, loadAllFarmsAndLastStake);
