import { combineEpics, Epic } from 'redux-observable';
import { catchError, forkJoin, map, mergeMap, Observable, of, switchMap } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { getKordFiItems$ } from 'src/apis/kord-fi';
import { getYouvesSavingsItems$ } from 'src/apis/youves';
import { showErrorToastByError } from 'src/toast/error-toast.utils';
import { withAccount, withSelectedRpcUrl, withUsdToTokenRates } from 'src/utils/wallet.utils';

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
    withAccount(state$, ([{ payload }]) => payload.accountPkh),
    mergeMap(([[{ payload }, rpcUrl], account]) =>
      loadSingleSavingStake$(payload.item, account, rpcUrl).pipe(
        map(stake =>
          loadSingleSavingStakeActions.success({
            stake: stake ?? undefined,
            contractAddress: payload.item.contractAddress,
            accountPkh: payload.accountPkh
          })
        ),
        catchError(err => {
          showErrorToastByError(err, undefined, true);

          return of(
            loadSingleSavingStakeActions.fail({
              contractAddress: payload.item.contractAddress,
              error: (err as Error).message,
              accountPkh: payload.accountPkh
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

const loadAllSavingsItemsAndStakes: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadAllSavingsAndStakesAction),
    withSelectedRpcUrl(state$),
    withUsdToTokenRates(state$),
    switchMap(([[{ payload: accountPkh }, rpcUrl], rates]) =>
      forkJoin([getYouvesSavingsItems$(rates, rpcUrl), getKordFiItems$(rates), of(accountPkh)])
    ),
    mergeMap(([youvesSavings, kordFiSavings, accountPkh]) => {
      if (youvesSavings.length === 0 && kordFiSavings.length === 0) {
        throw new Error('Failed to fetch any savings items');
      }

      return of(
        loadAllSavingsActions.success([...youvesSavings, ...kordFiSavings]),
        ...youvesSavings
          .concat(kordFiSavings)
          .map(savingsItem => loadSingleSavingStakeActions.submit({ item: savingsItem, accountPkh }))
      );
    }),
    catchError(err => {
      showErrorToastByError(err, undefined, true);

      return of(loadAllSavingsActions.fail(), loadAllStakesActions.fail());
    })
  );

export const savingsEpics = combineEpics(loadSingleSavingLastStake, loadAllSavingsItems, loadAllSavingsItemsAndStakes);
