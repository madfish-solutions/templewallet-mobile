import { debounce } from 'lodash-es';
import { combineEpics, Epic } from 'redux-observable';
import { catchError, forkJoin, map, merge, mergeMap, Observable, of, switchMap } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { getKordFiItems$, getKordFiUserDeposits$ } from 'src/apis/kord-fi';
import { getUserStake, getYouvesSavingsItems$ } from 'src/apis/youves';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { showErrorToastByError } from 'src/toast/error-toast.utils';
import { isDefined } from 'src/utils/is-defined';
import { withSelectedAccount, withSelectedRpcUrl, withUsdToTokenRates } from 'src/utils/wallet.utils';

import { RootState } from '../types';

import {
  loadAllSavingsActions,
  loadAllSavingsAndStakesAction,
  loadAllStakesActions,
  loadSingleSavingStakeActions
} from './actions';
import { loadSingleSavingStake$ } from './utils';

const loadSingleSavingLastStake: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadSingleSavingStakeActions.submit),
    withSelectedRpcUrl(state$),
    withSelectedAccount(state$),
    switchMap(([[{ payload: savingsItem }, rpcUrl], selectedAccount]) =>
      loadSingleSavingStake$(savingsItem, selectedAccount, rpcUrl).pipe(
        map(stake => loadSingleSavingStakeActions.success({ stake, contractAddress: savingsItem.contractAddress })),
        catchError(err => {
          showErrorToastByError(err, undefined, true);

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
    withSelectedRpcUrl(state$),
    withUsdToTokenRates(state$),
    switchMap(([[, rpcUrl], rates]) => getYouvesSavingsItems$(rates, rpcUrl)),
    map(savings => loadAllSavingsActions.success(savings)),
    catchError(err => {
      showErrorToastByError(err, undefined, true);

      return of(loadAllSavingsActions.fail());
    })
  );

const showStakeLoadError = debounce((e: unknown) => showErrorToastByError(e), 500, { leading: true, trailing: false });

const loadAllSavingsItemsAndStakes: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadAllSavingsAndStakesAction),
    withSelectedRpcUrl(state$),
    withUsdToTokenRates(state$),
    switchMap(([[, rpcUrl], rates]) => forkJoin([getYouvesSavingsItems$(rates, rpcUrl), getKordFiItems$(rates)])),
    withSelectedRpcUrl(state$),
    withSelectedAccount(state$),
    switchMap(([[[youvesSavings, kordFiSavings], rpcUrl], selectedAccount]) => {
      if (youvesSavings.length === 0 && kordFiSavings.length === 0) {
        throw new Error('Failed to fetch any savings items');
      }

      return forkJoin([
        forkJoin(
          youvesSavings.map(savingsItem =>
            getUserStake(selectedAccount, savingsItem.id, savingsItem.type, rpcUrl)
              .then((stake): [string, UserStakeValueInterface | undefined] => [savingsItem.contractAddress, stake])
              .catch(e => {
                console.error('Error while loading farm stakes: ', savingsItem.contractAddress);
                showStakeLoadError(e);

                return [savingsItem.contractAddress, undefined];
              })
          )
        ),
        getKordFiUserDeposits$(selectedAccount.publicKeyHash)
      ]).pipe(
        map(([youvesStakesEntries, kordFiStakesEntries]) => ({
          ...Object.fromEntries(
            youvesStakesEntries.filter((entry): entry is [string, UserStakeValueInterface] => isDefined(entry[1]))
          ),
          ...kordFiStakesEntries
        })),
        mergeMap(stakes =>
          merge(
            of(loadAllSavingsActions.success([...youvesSavings, ...kordFiSavings])),
            of(loadAllStakesActions.success(stakes))
          )
        )
      );
    }),
    catchError(err => {
      showErrorToastByError(err, undefined, true);

      return of(loadAllSavingsActions.fail(), loadAllStakesActions.fail());
    })
  );

export const savingsEpics = combineEpics(loadSingleSavingLastStake, loadAllSavingsItems, loadAllSavingsItemsAndStakes);
