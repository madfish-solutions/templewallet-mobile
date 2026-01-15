import { combineEpics } from 'redux-observable';
import { forkJoin, map, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ofType } from 'ts-action-operators';

import { sendErrorAnalyticsEvent } from 'src/utils/analytics/analytics.util';
import { withUserAnalyticsCredentials } from 'src/utils/error-analytics-data.utils';
import { loadUsdToTokenRates$, loadFiatToTezosRates$ } from 'src/utils/exchange-rate.util';

import { AnyActionEpic } from '../types';

import { loadExchangeRates } from './currency-actions';

const loadExchangeRatesEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadExchangeRates.submit),
    withUserAnalyticsCredentials(state$),
    switchMap(([, { isAnalyticsEnabled, userId, ABTestingCategory }]) =>
      forkJoin([loadUsdToTokenRates$(), loadFiatToTezosRates$()]).pipe(
        map(([usdToTokenRates, fiatToTezosRates]) => loadExchangeRates.success({ usdToTokenRates, fiatToTezosRates })),
        catchError(error => {
          if (isAnalyticsEnabled) {
            sendErrorAnalyticsEvent('LoadExchangeRatesEpicError', error, [], { userId, ABTestingCategory });
          }

          return of(loadExchangeRates.fail(error.message));
        })
      )
    )
  );

export const currencyEpics = combineEpics(loadExchangeRatesEpic);
