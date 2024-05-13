import { combineEpics, Epic } from 'redux-observable';
import { catchError, forkJoin, from, map, merge, mergeMap, Observable, of, switchMap } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { getKordFiItems$ } from 'src/apis/kord-fi';
import { getYouvesSavingsItems$ } from 'src/apis/youves';
import { SavingsProviderEnum } from 'src/enums/savings-provider.enum';
import { showErrorToast, showErrorToastByError } from 'src/toast/error-toast.utils';
import { showFailedStakeLoadWarning } from 'src/toast/toast.utils';
import { getAxiosQueryErrorMessage } from 'src/utils/get-axios-query-error-message';
import { withAccount, withSelectedRpcUrl, withUsdToTokenRates } from 'src/utils/wallet.utils';

import { RootState } from '../types';

import {
  loadAllSavingsAction,
  loadAllSavingsAndStakesAction,
  loadAllStakesActions,
  loadSavingsByProviderActions,
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
            stake,
            contractAddress: payload.item.contractAddress,
            accountPkh: payload.accountPkh
          })
        ),
        catchError(err => {
          showFailedStakeLoadWarning();

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
    ofType(loadAllSavingsAction),
    withSelectedRpcUrl(state$),
    withUsdToTokenRates(state$),
    switchMap(([[, rpcUrl], rates]) => forkJoin([getYouvesSavingsItems$(rates, rpcUrl), getKordFiItems$(rates)])),
    map(([youvesSavings, kordFiSavings]) =>
      of(
        loadSavingsByProviderActions.success({ data: youvesSavings, provider: SavingsProviderEnum.Youves }),
        loadSavingsByProviderActions.success({ data: kordFiSavings, provider: SavingsProviderEnum.KordFi })
      )
    ),
    catchError(err => {
      showErrorToastByError(err, undefined, true);

      return of(
        loadSavingsByProviderActions.fail({ provider: SavingsProviderEnum.Youves, error: (err as Error).message }),
        loadSavingsByProviderActions.fail({ provider: SavingsProviderEnum.KordFi, error: (err as Error).message })
      );
    })
  );

const loadSavingsItemsByProvider: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadSavingsByProviderActions.submit),
    withSelectedRpcUrl(state$),
    withUsdToTokenRates(state$),
    switchMap(([[{ payload: savingsProvider }, rpcUrl], rates]) =>
      from(
        savingsProvider === SavingsProviderEnum.KordFi ? getKordFiItems$(rates) : getYouvesSavingsItems$(rates, rpcUrl)
      ).pipe(
        map(data => loadSavingsByProviderActions.success({ data, provider: savingsProvider })),
        catchError(err => {
          showErrorToast({ description: getAxiosQueryErrorMessage(err) });

          return of(loadSavingsByProviderActions.fail({ provider: savingsProvider, error: (err as Error).message }));
        })
      )
    )
  );

const loadAllSavingsItemsAndStakes: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadAllSavingsAndStakesAction),
    withSelectedRpcUrl(state$),
    withUsdToTokenRates(state$),
    switchMap(([[{ payload: accountPkh }, rpcUrl], rates]) => {
      const makeSavingsListErrorHandler = (savingsProvider: SavingsProviderEnum) => (err: unknown) => {
        showErrorToast({ description: getAxiosQueryErrorMessage(err) });

        return of(
          loadSavingsByProviderActions.fail({ provider: savingsProvider, error: (err as Error).message }),
          loadAllStakesActions.fail()
        );
      };

      return merge(
        getYouvesSavingsItems$(rates, rpcUrl).pipe(
          switchMap(youvesSavings =>
            of(
              loadSavingsByProviderActions.success({ data: youvesSavings, provider: SavingsProviderEnum.Youves }),
              ...youvesSavings.map(savingsItem =>
                loadSingleSavingStakeActions.submit({ item: savingsItem, accountPkh })
              )
            )
          ),
          catchError(makeSavingsListErrorHandler(SavingsProviderEnum.Youves))
        ),
        getKordFiItems$(rates).pipe(
          switchMap(kordFiSavings =>
            of(
              loadSavingsByProviderActions.success({ data: kordFiSavings, provider: SavingsProviderEnum.KordFi }),
              ...kordFiSavings.map(savingsItem =>
                loadSingleSavingStakeActions.submit({ item: savingsItem, accountPkh })
              )
            )
          ),
          catchError(makeSavingsListErrorHandler(SavingsProviderEnum.KordFi))
        )
      );
    })
  );

export const savingsEpics = combineEpics(
  loadSingleSavingLastStake,
  loadAllSavingsItems,
  loadSavingsItemsByProvider,
  loadAllSavingsItemsAndStakes
);
