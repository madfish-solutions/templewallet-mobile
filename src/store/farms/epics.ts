import { combineEpics, Epic } from 'redux-observable';
import { catchError, forkJoin, from, map, mergeMap, Observable, of, switchMap } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { getLiquidityBakingFarm } from 'src/apis/liquidity-baking';
import { getV3FarmsList } from 'src/apis/quipuswap-staking';
import { showErrorToast, showErrorToastByError } from 'src/toast/error-toast.utils';
import { KNOWN_TOKENS_SLUGS } from 'src/token/data/token-slugs';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { getAxiosQueryErrorMessage } from 'src/utils/get-axios-query-error-message';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { withSelectedAccount, withSelectedRpcUrl } from 'src/utils/wallet.utils';

import type { RootState } from '../types';

import {
  loadAllFarmsActions,
  loadAllFarmsAndStakesAction,
  loadAllStakesActions,
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
            stake: stake ? toUserStakeValueInterface(stake, farm.vestingPeriodSeconds) : undefined,
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
      showErrorToastByError(err);

      return of(loadSingleFarmStakeActions.fail({ farmAddress, accountPkh, error: errorMessage }));
    })
  );

const loadAllFarms: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadAllFarmsActions.submit),
    withExchangeRates(state$),
    withSelectedAccount(state$),
    withSelectedRpcUrl(state$),
    switchMap(([[[, exchangeRates], selectedAccount], rpcUrl]) => {
      const tezos = createReadOnlyTezosToolkit(rpcUrl, selectedAccount);
      const { [KNOWN_TOKENS_SLUGS.tzBTC]: tzbtcExchangeRate, [TEZ_TOKEN_SLUG]: tezExchangeRate } = exchangeRates;

      return forkJoin([getV3FarmsList(), getLiquidityBakingFarm(tezos, tezExchangeRate, tzbtcExchangeRate)]).pipe(
        map(([v3Farms, lbFarm]) => loadAllFarmsActions.success([...v3Farms, lbFarm])),
        catchError(err => {
          showErrorToast({ description: getAxiosQueryErrorMessage(err) });

          return of(loadAllFarmsActions.fail());
        })
      );
    })
  );

const loadAllFarmsAndLastStake: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadAllFarmsAndStakesAction),
    withExchangeRates(state$),
    withSelectedRpcUrl(state$),
    switchMap(([[{ payload: accountPkh }, exchangeRates], rpcUrl]) => {
      const tezos = createReadOnlyTezosToolkit(rpcUrl);
      const { [KNOWN_TOKENS_SLUGS.tzBTC]: tzbtcExchangeRate, [TEZ_TOKEN_SLUG]: tezExchangeRate } = exchangeRates;

      return forkJoin([getV3FarmsList(), getLiquidityBakingFarm(tezos, tezExchangeRate, tzbtcExchangeRate)]).pipe(
        switchMap(([v3Farms, lbFarm]) => {
          const farms = [...v3Farms, lbFarm];

          return of(
            loadAllFarmsActions.success(farms),
            ...farms.map(({ item: farm }) => loadSingleFarmStakeActions.submit({ farm, accountPkh }))
          );
        })
      );
    }),
    catchError(err => {
      showErrorToast({ description: getAxiosQueryErrorMessage(err) });

      return of(loadAllFarmsActions.fail(), loadAllStakesActions.fail());
    })
  );

export const farmsEpics = combineEpics(loadSingleFarmLastStake, loadAllFarms, loadAllFarmsAndLastStake);
