import { combineEpics, Epic } from 'redux-observable';
import { catchError, EMPTY, forkJoin, map, merge, mergeMap, Observable, of, switchMap } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { getUserStake, getYouvesSavingsItems$ } from 'src/apis/youves';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { showErrorToastByError } from 'src/toast/error-toast.utils';
import { isDefined } from 'src/utils/is-defined';
import { withSelectedAccount, withUsdToTokenRates } from 'src/utils/wallet.utils';

import { RootState } from '../create-store';
import { loadAllSavingsActions, loadAllSavingsAndStakesAction, loadAllStakesActions } from './actions';

const loadAllSavingsItems: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadAllSavingsActions.submit),
    withUsdToTokenRates(state$),
    switchMap(([, rates]) => getYouvesSavingsItems$(rates)),
    map(savings => loadAllSavingsActions.success(savings)),
    catchError(err => {
      showErrorToastByError(err, undefined, true);

      return of(loadAllSavingsActions.fail());
    })
  );

const loadAllSavingsItemsAndStakes: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadAllSavingsAndStakesAction),
    withUsdToTokenRates(state$),
    switchMap(([, rates]) => getYouvesSavingsItems$(rates)),
    withSelectedAccount(state$),
    switchMap(([savings, selectedAccount]) =>
      forkJoin(
        savings.map(savingsItem =>
          getUserStake(selectedAccount, savingsItem.id, savingsItem.type)
            .then((stake): [string, UserStakeValueInterface | undefined] => [savingsItem.contractAddress, stake])
            .catch(() => {
              console.error('Error while loading farm stakes: ', savingsItem.contractAddress);

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
      )
    ),
    catchError(err => {
      showErrorToastByError(err, undefined, true);

      return mergeMap(() => merge(of(loadAllSavingsActions.fail()), of(loadAllStakesActions.fail())))(EMPTY);
    })
  );

export const savingsEpics = combineEpics(loadAllSavingsItems, loadAllSavingsItemsAndStakes);
