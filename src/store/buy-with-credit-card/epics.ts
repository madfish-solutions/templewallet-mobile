import { combineEpics } from 'redux-observable';
import { catchError, forkJoin, from, map, Observable, of, switchMap, withLatestFrom } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { getAliceBobPairsInfo } from 'src/apis/alice-bob';
import { getMoonPayCurrencies } from 'src/apis/moonpay';
import { getCurrenciesInfo as getUtorgCurrenciesInfo } from 'src/apis/utorg';
import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { showErrorToast } from 'src/toast/toast.utils';
import { PAIR_NOT_FOUND_MESSAGE } from 'src/utils/constants/buy-with-credit-card';
import { getAxiosQueryErrorMessage } from 'src/utils/get-axios-query-error-message';
import { getUpdatedFiatLimits } from 'src/utils/get-updated-fiat-limits.utils';
import { isDefined } from 'src/utils/is-defined';

import { createEntity } from '../create-entity';
import type { RootState } from '../types';
import { loadAllCurrenciesActions, updatePairLimitsActions } from './actions';
import { TopUpProviderCurrencies } from './state';
import { mapAliceBobProviderCurrencies, mapMoonPayProviderCurrencies, mapUtorgProviderCurrencies } from './utils';

const getCurrencies$ = <T>(
  fetchFn: () => Promise<T>,
  transformFn: (data: T) => TopUpProviderCurrencies,
  shouldShowErrorToast = true
) =>
  from(fetchFn()).pipe(
    map(data => createEntity(transformFn(data))),
    catchError(err => {
      const errorMessage = getAxiosQueryErrorMessage(err);
      if (shouldShowErrorToast) {
        console.log(errorMessage, 'err');
        showErrorToast({ description: errorMessage });
      }

      return of(createEntity<TopUpProviderCurrencies>({ fiat: [], crypto: [] }, false, errorMessage));
    })
  );

const allTopUpProviderEnums = [TopUpProviderEnum.MoonPay, TopUpProviderEnum.Utorg, TopUpProviderEnum.AliceBob];

const loadAllCurrenciesEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadAllCurrenciesActions.submit),
    switchMap(() =>
      forkJoin([
        getCurrencies$(getMoonPayCurrencies, mapMoonPayProviderCurrencies),
        getCurrencies$(getUtorgCurrenciesInfo, mapUtorgProviderCurrencies),
        getCurrencies$(getAliceBobPairsInfo, mapAliceBobProviderCurrencies)
      ]).pipe(
        map(([moonpayCurrencies, utorgCurrencies, tezUahPairInfo]) =>
          loadAllCurrenciesActions.success({
            [TopUpProviderEnum.MoonPay]: moonpayCurrencies,
            [TopUpProviderEnum.Utorg]: utorgCurrencies,
            [TopUpProviderEnum.AliceBob]: tezUahPairInfo
          })
        )
      )
    )
  );

const updatePairLimitsEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(updatePairLimitsActions.submit),
    withLatestFrom(state$),
    switchMap(([{ payload }, rootState]) => {
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
            return from(getUpdatedFiatLimits(fiatCurrency, cryptoCurrency, providerId));
          }

          return of(createEntity(undefined, false, PAIR_NOT_FOUND_MESSAGE));
        })
      ).pipe(
        map(([moonPayData, utorgData, aliceBobData]) =>
          updatePairLimitsActions.success({
            fiatSymbol,
            cryptoSymbol,
            limits: {
              [TopUpProviderEnum.MoonPay]: moonPayData,
              [TopUpProviderEnum.Utorg]: utorgData,
              [TopUpProviderEnum.AliceBob]: aliceBobData
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
