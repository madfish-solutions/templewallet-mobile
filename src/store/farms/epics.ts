import { combineEpics } from 'redux-observable';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { getSingleV3Farm } from 'src/apis/quipuswap-staking';
import { FarmVersionEnum, NetworkEnum } from 'src/apis/quipuswap-staking/types';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { getAxiosQueryErrorMessage } from 'src/utils/get-axios-query-error-message';

import { loadSingleFarmActions } from './actions';

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

export const farmsEpics = combineEpics(loadSingleFarm);
