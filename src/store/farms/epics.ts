import { combineEpics, Epic } from 'redux-observable';
import { catchError, delay, exhaustMap, forkJoin, from, map, merge, mergeMap, Observable, of, switchMap } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { getLiquidityBakingFarm } from 'src/apis/liquidity-baking';
import { getV3FarmsList } from 'src/apis/quipuswap-staking';
import { FarmsProviderEnum } from 'src/enums/farms-provider.enum';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { showFailedStakeLoadWarning } from 'src/toast/toast.utils';
import { KNOWN_TOKENS_SLUGS } from 'src/token/data/token-slugs';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { getAxiosQueryErrorMessage } from 'src/utils/get-axios-query-error-message';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { withSelectedAccount, withSelectedRpcUrl } from 'src/utils/wallet.utils';

import type { RootState } from '../types';

import {
  loadAllFarmsAction,
  loadAllFarmsAndStakesAction,
  loadAllStakesActions,
  loadFarmsByProviderActions,
  loadSingleFarmStakeActions
} from './actions';
import { getFarmStake, GetFarmStakeError, toUserStakeValueInterface, withExchangeRates } from './utils';

const loadSingleFarmLastStake: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
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

const loadAllFarms: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadAllFarmsAction),
    withExchangeRates(state$),
    withSelectedAccount(state$),
    withSelectedRpcUrl(state$),
    switchMap(([[[, exchangeRates], selectedAccount], rpcUrl]) => {
      const tezos = createReadOnlyTezosToolkit(rpcUrl, selectedAccount);
      const { [KNOWN_TOKENS_SLUGS.tzBTC]: tzbtcExchangeRate, [TEZ_TOKEN_SLUG]: tezExchangeRate } = exchangeRates;

      return forkJoin([getLiquidityBakingFarm(tezos, tezExchangeRate, tzbtcExchangeRate), getV3FarmsList()]);
    }),
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

const loadFarmsByProvider: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadFarmsByProviderActions.submit),
    withExchangeRates(state$),
    withSelectedAccount(state$),
    withSelectedRpcUrl(state$),
    switchMap(([[[{ payload: farmsProvider }, exchangeRates], selectedAccount], rpcUrl]) => {
      const tezos = createReadOnlyTezosToolkit(rpcUrl, selectedAccount);
      const { [KNOWN_TOKENS_SLUGS.tzBTC]: tzbtcExchangeRate, [TEZ_TOKEN_SLUG]: tezExchangeRate } = exchangeRates;

      return from(
        farmsProvider === FarmsProviderEnum.LiquidityBaking
          ? getLiquidityBakingFarm(tezos, tezExchangeRate, tzbtcExchangeRate).then(lbFarm => [lbFarm])
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

const loadAllFarmsAndStakes: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadAllFarmsAndStakesAction),
    withExchangeRates(state$),
    withSelectedRpcUrl(state$),
    exhaustMap(([[{ payload: accountPkh }, exchangeRates], rpcUrl]) => {
      const tezos = createReadOnlyTezosToolkit(rpcUrl);
      const { [KNOWN_TOKENS_SLUGS.tzBTC]: tzbtcExchangeRate, [TEZ_TOKEN_SLUG]: tezExchangeRate } = exchangeRates;

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
        from(getLiquidityBakingFarm(tezos, tezExchangeRate, tzbtcExchangeRate)).pipe(
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
