import { combineEpics, Epic } from 'redux-observable';
import { catchError, from, map, Observable, of, switchMap, withLatestFrom } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { getSingleV3Farm, getV3FarmStake } from 'src/apis/quipuswap-staking';
import { FarmVersionEnum } from 'src/apis/quipuswap-staking/types';
import { showErrorToast, showErrorToastByError } from 'src/toast/error-toast.utils';
import { getAxiosQueryErrorMessage } from 'src/utils/get-axios-query-error-message';
import { getSelectedAccount } from 'src/utils/wallet-account-state.utils';

import { RootState } from '../create-store';
import { loadSingleFarmActions, loadSingleFarmStakeActions } from './actions';
import { GetFarmStakeError } from './utils';

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
    withLatestFrom(state$),
    switchMap(([{ payload }, state]) => {
      const { id, version, contractAddress, rewardToken } = payload;
      const { selectedRpcUrl } = state.settings;

      if (version === FarmVersionEnum.V3) {
        return from(
          getV3FarmStake(selectedRpcUrl, contractAddress, getSelectedAccount(state.wallet), rewardToken)
        ).pipe(
          map(stake => loadSingleFarmStakeActions.success({ stake, farm: { id, version } })),
          catchError(err => {
            throw new GetFarmStakeError(id, version, (err as Error).message);
          })
        );
      }

      throw new GetFarmStakeError(id, version, `Farm version ${version} is not supported yet`);
    }),
    catchError(err => {
      const { farmId, farmVersion } = err as GetFarmStakeError;
      showErrorToastByError(err);

      return of(
        loadSingleFarmStakeActions.fail({ farm: { id: farmId, version: farmVersion }, error: (err as Error).message })
      );
    })
  );

export const farmsEpics = combineEpics(loadSingleFarm, loadSingleFarmBalances);
