import { combineEpics } from 'redux-observable';
import { catchError, forkJoin, from, map, of, switchMap, withLatestFrom } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { getMoonPayCurrencies } from 'src/apis/moonpay';
import { getCurrenciesInfo as getUtorgCurrenciesInfo } from 'src/apis/utorg';
import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { showErrorToast } from 'src/toast/toast.utils';
import { sendErrorAnalyticsEvent } from 'src/utils/analytics/analytics.util';
import { PAIR_NOT_FOUND_MESSAGE } from 'src/utils/constants/buy-with-credit-card';
import { UserAnalyticsCredentials, withUserAnalyticsCredentials } from 'src/utils/error-analytics-data.utils';
import { getAxiosQueryErrorMessage } from 'src/utils/get-axios-query-error-message';
import { getUpdatedFiatLimits } from 'src/utils/get-updated-fiat-limits.utils';
import { isDefined } from 'src/utils/is-defined';

import { createEntity } from '../create-entity';
import type { AnyActionEpic, RootState } from '../types';

import { loadAllCurrenciesActions, updatePairLimitsActions } from './actions';
import { TopUpProviderCurrencies } from './state';
import { mapMoonPayProviderCurrencies, mapUtorgProviderCurrencies } from './utils';

const getCurrencies$ = <T>(
  fetchFn: () => Promise<T>,
  transformFn: (data: T) => TopUpProviderCurrencies,
  providerId: TopUpProviderEnum,
  { userId, ABTestingCategory, isAnalyticsEnabled }: UserAnalyticsCredentials,
  shouldShowErrorToast = true
) =>
  from(fetchFn()).pipe(
    map(data => createEntity(transformFn(data))),
    catchError(err => {
      const errorMessage = getAxiosQueryErrorMessage(err);
      if (shouldShowErrorToast) {
        showErrorToast({ description: errorMessage });
      }

      if (isAnalyticsEnabled) {
        sendErrorAnalyticsEvent('LoadAllCurrenciesEpicError', err, [], { userId, ABTestingCategory }, { providerId });
      }

      return of(createEntity<TopUpProviderCurrencies>({ fiat: [], crypto: [] }, false, errorMessage));
    })
  );

const allTopUpProviderEnums = [TopUpProviderEnum.MoonPay, TopUpProviderEnum.Utorg];

const loadAllCurrenciesEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadAllCurrenciesActions.submit),
    withUserAnalyticsCredentials(state$),
    switchMap(([, userAnalyticsCredentials]) =>
      forkJoin([
        getCurrencies$(
          getMoonPayCurrencies,
          mapMoonPayProviderCurrencies,
          TopUpProviderEnum.MoonPay,
          userAnalyticsCredentials
        ),
        getCurrencies$(
          getUtorgCurrenciesInfo,
          mapUtorgProviderCurrencies,
          TopUpProviderEnum.Utorg,
          userAnalyticsCredentials
        )
      ]).pipe(
        map(([moonpayCurrencies, utorgCurrencies]) =>
          loadAllCurrenciesActions.success({
            [TopUpProviderEnum.MoonPay]: moonpayCurrencies,
            [TopUpProviderEnum.Utorg]: utorgCurrencies
          })
        )
      )
    )
  );

const updatePairLimitsEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(updatePairLimitsActions.submit),
    withLatestFrom(state$),
    withUserAnalyticsCredentials(state$),
    switchMap(([[{ payload }, rootState], { userId, ABTestingCategory, isAnalyticsEnabled }]) => {
      const { fiatSymbol, cryptoSymbol } = payload;
      const { currencies } = rootState.buyWithCreditCard;
      const currentLimits = rootState.buyWithCreditCard.pairLimits[fiatSymbol]?.[cryptoSymbol];

      return forkJoin(
        allTopUpProviderEnums.map(providerId => {
          const fiatCurrencies = currencies[providerId].data.fiat;
          const cryptoCurrencies = currencies[providerId].data.crypto;
          if (fiatCurrencies.length < 1 || cryptoCurrencies.length < 1) {
            return of(createEntity(undefined));
          }

          const prevEntity = currentLimits?.[providerId];
          if (prevEntity?.error === PAIR_NOT_FOUND_MESSAGE) {
            return of(createEntity(undefined, false, PAIR_NOT_FOUND_MESSAGE));
          }

          const fiatCurrency = fiatCurrencies.find(({ code }) => code === fiatSymbol);
          const cryptoCurrency = cryptoCurrencies.find(({ code }) => code === cryptoSymbol);

          if (isDefined(fiatCurrency) && isDefined(cryptoCurrency)) {
            return from(
              getUpdatedFiatLimits(
                fiatCurrency,
                cryptoCurrency,
                providerId,
                isAnalyticsEnabled
                  ? err =>
                      sendErrorAnalyticsEvent(
                        'UpdatePairLimitsEpicError',
                        err,
                        [],
                        { userId, ABTestingCategory },
                        { fiatSymbol, cryptoSymbol, providerId }
                      )
                  : undefined
              )
            );
          }

          return of(createEntity(undefined, false, PAIR_NOT_FOUND_MESSAGE));
        })
      ).pipe(
        map(([moonPayData, utorgData]) =>
          updatePairLimitsActions.success({
            fiatSymbol,
            cryptoSymbol,
            limits: {
              [TopUpProviderEnum.MoonPay]: moonPayData,
              [TopUpProviderEnum.Utorg]: utorgData
            }
          })
        )
      );
    })
  );

export const buyWithCreditCardEpics = combineEpics<Action, Action, RootState>(
  loadAllCurrenciesEpic,
  updatePairLimitsEpic
);
