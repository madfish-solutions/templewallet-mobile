import { combineEpics, Epic } from 'redux-observable';
import { catchError, delay, exhaustMap, forkJoin, from, map, merge, mergeMap, of, switchMap } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { getLiquidityBakingFarm } from 'src/apis/liquidity-baking';
import { getV3FarmsList } from 'src/apis/quipuswap-staking';
import { FarmsProviderEnum } from 'src/enums/farms-provider.enum';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { showFailedStakeLoadWarning } from 'src/toast/toast.utils';
import { getAxiosQueryErrorMessage } from 'src/utils/get-axios-query-error-message';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { withSelectedRpcUrl } from 'src/utils/wallet.utils';

import type { RootState } from '../types';

import {
  loadAllFarmsAction,
  loadAllFarmsAndStakesAction,
  loadAllStakesActions,
  loadFarmsByProviderActions,
  loadSingleFarmStakeActions
} from './actions';
import { getFarmStake, GetFarmStakeError, toUserStakeValueInterface } from './utils';

const loadSingleFarmLastStake: Epic<Action, Action, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(loadSingleFarmStakeActions.submit),
    withSelectedRpcUrl(state$),
    mergeMap(([{ payload }, rpcUrl]) => {
      const { farm, accountPkh } = payload;
      const tezos = createReadOnlyTezosToolkit(rpcUrl);

      return from(getFarmStake(farm, tezos, accountPkh)).pipe(
        map(stake =>
          loadSingleFarmStakeActions.success({
            stake: stake && toUserStakeValueInterface(stake, farm.vestingPeriodSeconds),
            farmAddress: farm.contractAddress,
            accountPkh
          })
        ),
        catchError(err => {
          throw new GetFarmStakeError(farm.contractAddress, accountPkh, (err as Error).message);
        })
      );
    }),
    catchError(err => {
      const { farmAddress, accountPkh, message: errorMessage } = err as GetFarmStakeError;
      showFailedStakeLoadWarning();

      return of(loadSingleFarmStakeActions.fail({ farmAddress, accountPkh, error: errorMessage }));
    })
  );

const loadAllFarms: Epic = action$ =>
  action$.pipe(
    ofType(loadAllFarmsAction),
    switchMap(() => forkJoin([getLiquidityBakingFarm(), getV3FarmsList()])),
    switchMap(([lbFarm, v3Farms]) =>
      of(
        loadFarmsByProviderActions.success({ data: [lbFarm], provider: FarmsProviderEnum.LiquidityBaking }),
        loadFarmsByProviderActions.success({ data: v3Farms, provider: FarmsProviderEnum.Quipuswap })
      )
    ),
    catchError(err => {
      showErrorToast({ description: getAxiosQueryErrorMessage(err) });

      return of(
        loadFarmsByProviderActions.fail({ provider: FarmsProviderEnum.LiquidityBaking, error: (err as Error).message }),
        loadFarmsByProviderActions.fail({ provider: FarmsProviderEnum.Quipuswap, error: (err as Error).message })
      );
    })
  );

const loadFarmsByProvider: Epic = action$ =>
  action$.pipe(
    ofType(loadFarmsByProviderActions.submit),
    switchMap(({ payload: farmsProvider }) => {
      return from(
        farmsProvider === FarmsProviderEnum.LiquidityBaking
          ? getLiquidityBakingFarm().then(lbFarm => [lbFarm])
          : getV3FarmsList()
      ).pipe(
        map(data => loadFarmsByProviderActions.success({ data, provider: farmsProvider })),
        catchError(err => {
          showErrorToast({ description: getAxiosQueryErrorMessage(err) });

          return of(loadFarmsByProviderActions.fail({ provider: farmsProvider, error: (err as Error).message }));
        })
      );
    })
  );

const loadAllFarmsAndStakes: Epic = action$ =>
  action$.pipe(
    ofType(loadAllFarmsAndStakesAction),
    exhaustMap(({ payload: accountPkh }) => {
      const makeFarmsListErrorHandler = (farmsProvider: FarmsProviderEnum) => (err: unknown) => {
        showErrorToast({ description: getAxiosQueryErrorMessage(err) });

        return of(
          loadFarmsByProviderActions.fail({ provider: farmsProvider, error: (err as Error).message }),
          loadAllStakesActions.fail()
        );
      };

      return merge(
        from(getV3FarmsList()).pipe(
          delay(20_000),
          switchMap(v3Farms =>
            of(
              loadFarmsByProviderActions.success({ data: v3Farms, provider: FarmsProviderEnum.Quipuswap }),
              ...v3Farms.map(({ item: farm }) => loadSingleFarmStakeActions.submit({ farm, accountPkh }))
            )
          ),
          catchError(makeFarmsListErrorHandler(FarmsProviderEnum.Quipuswap))
        ),
        from(getLiquidityBakingFarm()).pipe(
          switchMap(lbFarm =>
            of(
              loadFarmsByProviderActions.success({ data: [lbFarm], provider: FarmsProviderEnum.LiquidityBaking }),
              loadSingleFarmStakeActions.submit({ farm: lbFarm.item, accountPkh })
            )
          ),
          catchError(makeFarmsListErrorHandler(FarmsProviderEnum.LiquidityBaking))
        )
      );
    })
  );

export const farmsEpics = combineEpics(
  loadSingleFarmLastStake,
  loadAllFarms,
  loadFarmsByProvider,
  loadAllFarmsAndStakes
);
