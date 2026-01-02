import { combineEpics } from 'redux-observable';
import { catchError, delay, exhaustMap, forkJoin, from, map, merge, mergeMap, of, switchMap } from 'rxjs';
import { ofType } from 'ts-action-operators';

import { getLiquidityBakingFarm } from 'src/apis/liquidity-baking';
import { getV3FarmsList } from 'src/apis/quipuswap-staking';
import { FarmsProviderEnum } from 'src/enums/farms-provider.enum';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { showFailedStakeLoadWarning } from 'src/toast/toast.utils';
import { sendErrorAnalyticsEvent } from 'src/utils/analytics/analytics.util';
import {
  AnalyticsError,
  UserAnalyticsCredentials,
  withUserAnalyticsCredentials
} from 'src/utils/error-analytics-data.utils';
import { getAxiosQueryErrorMessage } from 'src/utils/get-axios-query-error-message';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { withSelectedRpcUrl } from 'src/utils/wallet.utils';

import type { AnyActionEpic } from '../types';

import {
  loadAllFarmsAction,
  loadAllFarmsAndStakesAction,
  loadAllStakesActions,
  loadFarmsByProviderActions,
  loadSingleFarmStakeActions
} from './actions';
import { getFarmStake, GetFarmStakeError, toUserStakeValueInterface } from './utils';

const makeFarmsListErrorHandlerBase =
  (event: string) =>
  (err: unknown, userAnalyticsCredentials: UserAnalyticsCredentials, farmsProvider?: FarmsProviderEnum) => {
    const { userId, ABTestingCategory, isAnalyticsEnabled } = userAnalyticsCredentials;
    const internalError = err instanceof AnalyticsError ? err.error : err;
    const additionalProperties = err instanceof AnalyticsError ? err.additionalProperties : {};
    showErrorToast({ description: getAxiosQueryErrorMessage(internalError) });

    if (isAnalyticsEnabled) {
      sendErrorAnalyticsEvent(
        event,
        internalError,
        [],
        { userId, ABTestingCategory },
        { provider: farmsProvider, ...additionalProperties }
      );
    }
  };

const loadSingleFarmLastStake: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadSingleFarmStakeActions.submit),
    withSelectedRpcUrl(state$),
    withUserAnalyticsCredentials(state$),
    mergeMap(([[{ payload }, rpcUrl], { isAnalyticsEnabled, userId, ABTestingCategory }]) => {
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
          if (isAnalyticsEnabled) {
            sendErrorAnalyticsEvent(
              'LoadSingleFarmLastStakeEpicError',
              err,
              [accountPkh],
              { userId, ABTestingCategory },
              { farm }
            );
          }

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

const loadAllFarmsErrorHandlerBase = makeFarmsListErrorHandlerBase('LoadAllFarmsEpicError');
const loadAllFarms: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadAllFarmsAction),
    withUserAnalyticsCredentials(state$),
    switchMap(([, userAnalyticsCredentials]) =>
      forkJoin([getLiquidityBakingFarm(), getV3FarmsList()]).pipe(
        switchMap(([lbFarm, v3Farms]) =>
          of(
            loadFarmsByProviderActions.success({ data: [lbFarm], provider: FarmsProviderEnum.LiquidityBaking }),
            loadFarmsByProviderActions.success({ data: v3Farms, provider: FarmsProviderEnum.Quipuswap })
          )
        ),
        catchError(err => {
          loadAllFarmsErrorHandlerBase(err, userAnalyticsCredentials);

          return of(
            loadFarmsByProviderActions.fail({
              provider: FarmsProviderEnum.LiquidityBaking,
              error: (err as Error).message
            }),
            loadFarmsByProviderActions.fail({ provider: FarmsProviderEnum.Quipuswap, error: (err as Error).message })
          );
        })
      )
    )
  );

const loadFarmsByProviderErrorHandlerBase = makeFarmsListErrorHandlerBase('LoadFarmsByProviderEpicError');
const loadFarmsByProvider: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadFarmsByProviderActions.submit),
    withUserAnalyticsCredentials(state$),
    switchMap(([{ payload: farmsProvider }, userAnalyticsCredentials]) => {
      return from(
        farmsProvider === FarmsProviderEnum.LiquidityBaking
          ? getLiquidityBakingFarm().then(lbFarm => [lbFarm])
          : getV3FarmsList()
      ).pipe(
        map(data => loadFarmsByProviderActions.success({ data, provider: farmsProvider })),
        catchError(err => {
          loadFarmsByProviderErrorHandlerBase(err, userAnalyticsCredentials, farmsProvider);

          return of(loadFarmsByProviderActions.fail({ provider: farmsProvider, error: (err as Error).message }));
        })
      );
    })
  );

const loadAllFarmsAndStakesErrorHandlerBase = makeFarmsListErrorHandlerBase('LoadAllFarmsAndStakesEpicError');
const loadAllFarmsAndStakes: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadAllFarmsAndStakesAction),
    withUserAnalyticsCredentials(state$),
    exhaustMap(([{ payload: accountPkh }, userAnalyticsCredentials]) => {
      const makeFarmsListErrorHandler = (farmsProvider: FarmsProviderEnum) => (err: unknown) => {
        loadAllFarmsAndStakesErrorHandlerBase(err, userAnalyticsCredentials, farmsProvider);

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
