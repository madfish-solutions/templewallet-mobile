import { debounce } from 'lodash-es';
import { combineEpics, Epic } from 'redux-observable';
import { catchError, forkJoin, from, map, merge, mergeMap, Observable, of, switchMap } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { getUserStake, getYouvesSavingsItems$ } from 'src/apis/youves';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { isDefined } from 'src/utils/is-defined';
import { withSelectedAccount, withUsdToTokenRates } from 'src/utils/wallet.utils';

import { RootState } from '../types';
import {
  loadAllSavingsActions,
  loadAllSavingsAndStakesAction,
  loadAllStakesActions,
  loadSingleSavingStakeActions
} from './actions';

const DEFAULT_ERROR_MESSAGE = { description: 'Something went wrong. Please try again later.' };

const loadSingleSavingLastStake: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadSingleSavingStakeActions.submit),
    withSelectedAccount(state$),
    switchMap(([{ payload: savingsItem }, selectedAccount]) =>
      from(getUserStake(selectedAccount, savingsItem.id, savingsItem.type)).pipe(
        map(stake => loadSingleSavingStakeActions.success({ stake, contractAddress: savingsItem.contractAddress })),
        catchError(err => {
          showErrorToast(DEFAULT_ERROR_MESSAGE);

          return of(
            loadSingleSavingStakeActions.fail({
              contractAddress: savingsItem.contractAddress,
              error: (err as Error).message
            })
          );
        })
      )
    )
  );

const loadAllSavingsItems: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadAllSavingsActions.submit),
    withUsdToTokenRates(state$),
    switchMap(([, rates]) => getYouvesSavingsItems$(rates)),
    map(savings => loadAllSavingsActions.success(savings)),
    catchError(() => {
      showErrorToast(DEFAULT_ERROR_MESSAGE);

      return of(loadAllSavingsActions.fail());
    })
  );

const showStakeLoadError = debounce(() => showErrorToast(DEFAULT_ERROR_MESSAGE), 500, {
  leading: true,
  trailing: false
});

const loadAllSavingsItemsAndStakes: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadAllSavingsAndStakesAction),
    withUsdToTokenRates(state$),
    switchMap(([, rates]) => getYouvesSavingsItems$(rates)),
    withSelectedAccount(state$),
    switchMap(([savings, selectedAccount]) => {
      if (savings.length === 0) {
        throw new Error('Failed to fetch any savings items');
      }

      return forkJoin(
        savings.map(savingsItem =>
          getUserStake(selectedAccount, savingsItem.id, savingsItem.type)
            .then((stake): [string, UserStakeValueInterface | undefined] => [savingsItem.contractAddress, stake])
            .catch(() => {
              console.error('Error while loading farm stakes: ', savingsItem.contractAddress);
              showStakeLoadError();

              return [savingsItem.contractAddress, undefined];
            })
        )
      ).pipe(
        map(stakesEntries =>
          Object.fromEntries(
            stakesEntries.filter((entry): entry is [string, UserStakeValueInterface] => isDefined(entry[1]))
          )
        ),
        mergeMap(stakes => merge(of(loadAllSavingsActions.success(savings)), of(loadAllStakesActions.success(stakes))))
      );
    }),
    catchError(() => {
      showErrorToast(DEFAULT_ERROR_MESSAGE);

      return of(loadAllSavingsActions.fail(), loadAllStakesActions.fail());
    })
  );

export const savingsEpics = combineEpics(loadSingleSavingLastStake, loadAllSavingsItems, loadAllSavingsItemsAndStakes);
