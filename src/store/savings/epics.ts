import { combineEpics } from 'redux-observable';
import { catchError, map, merge, mergeMap, of, switchMap } from 'rxjs';
import { ofType } from 'ts-action-operators';

import { getYouvesSavingsItems$ } from 'src/apis/youves';
import { SavingsProviderEnum } from 'src/enums/savings-provider.enum';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { showFailedStakeLoadWarning } from 'src/toast/toast.utils';
import { sendErrorAnalyticsEvent } from 'src/utils/analytics/analytics.util';
import { UserAnalyticsCredentials, withUserAnalyticsCredentials } from 'src/utils/error-analytics-data.utils';
import { getAxiosQueryErrorMessage } from 'src/utils/get-axios-query-error-message';
import { withAccount, withUsdToTokenRates } from 'src/utils/wallet.utils';

import { AnyActionEpic } from '../types';

import {
  loadAllSavingsAction,
  loadAllSavingsAndStakesAction,
  loadAllStakesActions,
  loadSavingsByProviderActions,
  loadSingleSavingStakeActions
} from './actions';
import { loadSingleSavingStake$ } from './utils';

const makeSavingsListErrorHandlerBase =
  (event: string) =>
  (err: unknown, userAnalyticsCredentials: UserAnalyticsCredentials, provider?: SavingsProviderEnum) => {
    const { userId, ABTestingCategory, isAnalyticsEnabled } = userAnalyticsCredentials;

    showErrorToast({ description: getAxiosQueryErrorMessage(err) });

    if (isAnalyticsEnabled) {
      sendErrorAnalyticsEvent(event, err, [], { userId, ABTestingCategory }, { provider });
    }
  };

const loadSingleSavingLastStake: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadSingleSavingStakeActions.submit),
    withAccount(state$),
    withUserAnalyticsCredentials(state$),
    mergeMap(([[{ payload }, account], { isAnalyticsEnabled, userId, ABTestingCategory }]) =>
      loadSingleSavingStake$(payload.item, account).pipe(
        map(stake =>
          loadSingleSavingStakeActions.success({
            stake,
            contractAddress: payload.item.contractAddress,
            accountPkh: payload.accountPkh
          })
        ),
        catchError(err => {
          showFailedStakeLoadWarning();

          if (isAnalyticsEnabled) {
            sendErrorAnalyticsEvent(
              'LoadSingleSavingLastStakeEpicError',
              err,
              [],
              { userId, ABTestingCategory },
              { item: payload.item }
            );
          }

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

const loadAllSavingsItemsErrorHandlerBase = makeSavingsListErrorHandlerBase('LoadAllSavingsItemsEpicError');
const loadAllSavingsItems: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadAllSavingsAction),
    withUsdToTokenRates(state$),
    withUserAnalyticsCredentials(state$),
    switchMap(([[, rates], userAnalyticsCredentials]) =>
      getYouvesSavingsItems$(rates).pipe(
        switchMap(youvesSavings =>
          of(loadSavingsByProviderActions.success({ data: youvesSavings, provider: SavingsProviderEnum.Youves }))
        ),
        catchError(err => {
          loadAllSavingsItemsErrorHandlerBase(err, userAnalyticsCredentials);

          return of(
            loadSavingsByProviderActions.fail({ provider: SavingsProviderEnum.Youves, error: (err as Error).message })
          );
        })
      )
    )
  );

const loadSavingsItemsByProviderErrorHandlerBase = makeSavingsListErrorHandlerBase(
  'LoadSavingsItemsByProviderEpicError'
);
const loadSavingsItemsByProvider: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadSavingsByProviderActions.submit),
    withUsdToTokenRates(state$),
    withUserAnalyticsCredentials(state$),
    switchMap(([[{ payload: savingsProvider }, rates], userAnalyticsCredentials]) =>
      getYouvesSavingsItems$(rates).pipe(
        map(data => loadSavingsByProviderActions.success({ data, provider: savingsProvider })),
        catchError(err => {
          loadSavingsItemsByProviderErrorHandlerBase(err, userAnalyticsCredentials, savingsProvider);

          return of(loadSavingsByProviderActions.fail({ provider: savingsProvider, error: (err as Error).message }));
        })
      )
    )
  );

const loadAllSavingsItemsAndStakesErrorHandlerBase = makeSavingsListErrorHandlerBase(
  'LoadAllSavingsItemsAndStakesEpicError'
);
const loadAllSavingsItemsAndStakes: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadAllSavingsAndStakesAction),
    withUsdToTokenRates(state$),
    withUserAnalyticsCredentials(state$),
    switchMap(([[{ payload: accountPkh }, rates], userAnalyticsCredentials]) => {
      const makeSavingsListErrorHandler = (savingsProvider: SavingsProviderEnum) => (err: unknown) => {
        loadAllSavingsItemsAndStakesErrorHandlerBase(err, userAnalyticsCredentials, savingsProvider);

        return of(
          loadSavingsByProviderActions.fail({ provider: savingsProvider, error: (err as Error).message }),
          loadAllStakesActions.fail()
        );
      };

      return merge(
        getYouvesSavingsItems$(rates).pipe(
          switchMap(youvesSavings =>
            of(
              loadSavingsByProviderActions.success({ data: youvesSavings, provider: SavingsProviderEnum.Youves }),
              ...youvesSavings.map(savingsItem =>
                loadSingleSavingStakeActions.submit({ item: savingsItem, accountPkh })
              )
            )
          ),
          catchError(makeSavingsListErrorHandler(SavingsProviderEnum.Youves))
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
