import { combineEpics } from 'redux-observable';
import { catchError, forkJoin, from, map, Observable, of, switchMap, withLatestFrom } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { getTezUahPairInfo } from 'src/apis/alice-bob';
import { getMoonPayCurrencies } from 'src/apis/moonpay';
import { getBinanceConnectCurrencies } from 'src/apis/temple-static';
import { getCurrenciesInfo as getUtorgCurrenciesInfo } from 'src/apis/utorg';
import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { showErrorToast } from 'src/toast/toast.utils';
import { PAIR_NOT_FOUND_MESSAGE } from 'src/utils/constants/buy-with-credit-card';
import { getAxiosQueryErrorMessage } from 'src/utils/get-axios-query-error-message';
import { getUpdatedFiatLimits } from 'src/utils/get-updated-fiat-limits.utils';
import { isDefined } from 'src/utils/is-defined';

import { createEntity } from '../create-entity';
import { loadAllCurrenciesActions, updatePairLimitsActions } from './actions';
import { BuyWithCreditCardRootState, TopUpProviderCurrencies } from './state';
import {
  mapAliceBobProviderCurrencies,
  mapBinanceConnectProviderCurrencies,
  mapMoonPayProviderCurrencies,
  mapUtorgProviderCurrencies
} from './utils';

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
        showErrorToast({ description: errorMessage });
      }

      return of(createEntity<TopUpProviderCurrencies>({ fiat: [], crypto: [] }, false, errorMessage));
    })
  );

const allTopUpProviderEnums = [
  TopUpProviderEnum.MoonPay,
  TopUpProviderEnum.Utorg,
  TopUpProviderEnum.AliceBob,
  TopUpProviderEnum.BinanceConnect
];

const loadAllCurrenciesEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadAllCurrenciesActions.submit),
    switchMap(() =>
      forkJoin([
        getCurrencies$(getMoonPayCurrencies, mapMoonPayProviderCurrencies),
        getCurrencies$(getUtorgCurrenciesInfo, mapUtorgProviderCurrencies),
        // TODO: return showing error toast as soon as Alice&Bob API starts working
        getCurrencies$(() => getTezUahPairInfo(), mapAliceBobProviderCurrencies, false),
        getCurrencies$(getBinanceConnectCurrencies, mapBinanceConnectProviderCurrencies)
      ]).pipe(
        map(([moonpayCurrencies, utorgCurrencies, tezUahPairInfo, binanceConnectCurrencies]) =>
          loadAllCurrenciesActions.success({
            [TopUpProviderEnum.MoonPay]: moonpayCurrencies,
            [TopUpProviderEnum.Utorg]: utorgCurrencies,
            [TopUpProviderEnum.AliceBob]: tezUahPairInfo,
            [TopUpProviderEnum.BinanceConnect]: binanceConnectCurrencies
          })
        )
      )
    )
  );

const updatePairLimitsEpic = (action$: Observable<Action>, state$: Observable<BuyWithCreditCardRootState>) =>
  action$.pipe(
    ofType(updatePairLimitsActions.submit),
    withLatestFrom(state$),
    switchMap(([{ payload }, rootState]) => {
      const { currencies } = rootState.buyWithCreditCard;
      const { fiatSymbol, cryptoSymbol } = payload;

      return forkJoin(
        allTopUpProviderEnums.map(providerId => {
          const fiatCurrency = currencies[providerId].data.fiat.find(({ code }) => code === fiatSymbol);
          const cryptoCurrency = currencies[providerId].data.crypto.find(({ code }) => code === cryptoSymbol);

          if (isDefined(fiatCurrency) && isDefined(cryptoCurrency)) {
            return from(getUpdatedFiatLimits(fiatCurrency, cryptoCurrency, providerId));
          }

          return of(createEntity(undefined, false, PAIR_NOT_FOUND_MESSAGE));
        })
      ).pipe(
        map(([moonPayData, utorgData, aliceBobData, binanceConnectData]) =>
          updatePairLimitsActions.success({
            fiatSymbol,
            cryptoSymbol,
            limits: {
              [TopUpProviderEnum.MoonPay]: moonPayData,
              [TopUpProviderEnum.Utorg]: utorgData,
              [TopUpProviderEnum.AliceBob]: aliceBobData,
              [TopUpProviderEnum.BinanceConnect]: binanceConnectData
            }
          })
        )
      );
    })
  );

export const buyWithCreditCardEpics = combineEpics<Action, Action, BuyWithCreditCardRootState>(
  loadAllCurrenciesEpic,
  updatePairLimitsEpic
);
