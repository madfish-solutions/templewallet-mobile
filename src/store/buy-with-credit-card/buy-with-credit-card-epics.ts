import { combineEpics } from 'redux-observable';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { fetchMoonpayCryptoCurrencies$, fetchMoonpayFiatCurrencies$ } from 'src/apollo/moonpay';
import { TopUpInputTypeEnum } from 'src/enums/top-up-input-type.enum';
import { TopUpInputInterface, TopUpOutputInterface } from 'src/interfaces/topup.interface';
import { showErrorToast } from 'src/toast/toast.utils';
import { getTezUahPairInfo } from 'src/utils/alice-bob.utils';
import {
  getCurrenciesInfo as getUtorgCurrenciesInfo,
  UTORG_CRYPTO_ICONS_BASE_URL,
  UTORG_FIAT_ICONS_BASE_URL
} from 'src/utils/utorg.utils';

import {
  loadAliceBobCurrenciesActions,
  loadMoonPayCryptoCurrenciesActions,
  loadMoonPayFiatCurrenciesActions,
  loadUtorgCurrenciesActions
} from './buy-with-credit-card-actions';

const knownUtorgFiatCurrenciesNames: Record<string, string> = {
  PHP: 'Philippine Peso',
  INR: 'Indian Rupee'
};

const loadMoonPayFiatCurrenciesEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadMoonPayFiatCurrenciesActions.submit),
    switchMap(() =>
      fetchMoonpayFiatCurrencies$().pipe(
        map(fiatCurrencies =>
          loadMoonPayFiatCurrenciesActions.success(
            fiatCurrencies.map(({ name, code, icon, minBuyAmount, maxBuyAmount, precision }) => ({
              name,
              code: code.toUpperCase(),
              network: '',
              networkFullName: '',
              icon,
              minAmount: minBuyAmount,
              maxAmount: maxBuyAmount,
              precision,
              type: TopUpInputTypeEnum.Fiat
            }))
          )
        ),
        catchError(err => {
          showErrorToast({ description: `Failed to get MoonPay fiat currencies: ${err.message}` });

          return of(loadMoonPayFiatCurrenciesActions.fail(err.message));
        })
      )
    )
  );

const loadMoonPayCryptoCurrenciesEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadMoonPayCryptoCurrenciesActions.submit),
    switchMap(() =>
      fetchMoonpayCryptoCurrencies$().pipe(
        map(cryptoCurrencies =>
          loadMoonPayCryptoCurrenciesActions.success(
            cryptoCurrencies
              .filter(({ networkCode }) => networkCode.toLowerCase() === 'tezos')
              .map(({ name, code, icon, precision }) => ({
                name,
                code: code.toUpperCase(),
                network: 'tezos',
                networkFullName: 'Tezos',
                icon,
                precision,
                type: TopUpInputTypeEnum.Crypto,
                slug: '' // TODO: implement making correct slug as soon as any Tezos token is supported by Moonpay
              }))
          )
        ),
        catchError(err => {
          showErrorToast({ description: `Failed to get MoonPay crypto currencies: ${err.message}` });

          return of(loadMoonPayFiatCurrenciesActions.fail(err.message));
        })
      )
    )
  );

const loadUtorgCurrenciesEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadUtorgCurrenciesActions.submit),
    switchMap(() =>
      from(getUtorgCurrenciesInfo()).pipe(
        map(currencies =>
          loadUtorgCurrenciesActions.success({
            fiat: currencies
              .filter(({ type, depositMax }) => type === 'FIAT' && depositMax > 0)
              .map(({ symbol, depositMin, depositMax, precision }) => ({
                name: knownUtorgFiatCurrenciesNames[symbol] ?? '',
                code: symbol,
                network: '',
                networkFullName: '',
                icon: `${UTORG_FIAT_ICONS_BASE_URL}${symbol.slice(0, -1)}.svg`,
                precision,
                type: TopUpInputTypeEnum.Fiat,
                minAmount: depositMin,
                maxAmount: depositMax
              })),
            crypto: currencies
              .filter(({ chain, type, depositMax }) => type === 'CRYPTO' && depositMax > 0 && chain === 'TEZOS')
              .map(({ currency, symbol, precision }) => ({
                name: symbol,
                code: symbol,
                network: 'tezos',
                networkFullName: 'Tezos',
                icon: `${UTORG_CRYPTO_ICONS_BASE_URL}/${currency}.svg`,
                precision,
                type: TopUpInputTypeEnum.Crypto,
                slug: '' // TODO: implement making correct slug as soon as any Tezos token is supported by Utorg
              }))
          })
        ),
        catchError(err => {
          showErrorToast({ description: `Failed to get Utorg currencies: ${err.message}` });

          return of(loadMoonPayFiatCurrenciesActions.fail(err.message));
        })
      )
    )
  );

const loadAliceBobCurrenciesEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadAliceBobCurrenciesActions.submit),
    switchMap(() =>
      from(getTezUahPairInfo()).pipe(
        map(({ minAmount, maxAmount }) =>
          loadAliceBobCurrenciesActions.success({
            fiat: [
              {
                name: 'Ukrainian Hryvnia',
                code: 'UAH',
                network: '',
                networkFullName: '',
                icon: '',
                precision: 2,
                minAmount: minAmount,
                maxAmount: maxAmount,
                type: TopUpInputTypeEnum.Fiat
              }
            ],
            crypto: [
              {
                name: 'Tezos',
                code: 'XTZ',
                network: 'tezos',
                networkFullName: 'Tezos',
                icon: 'https://static.moonpay.com/widget/currencies/xtz.svg',
                precision: 6,
                slug: 'tez',
                type: TopUpInputTypeEnum.Crypto
              }
            ]
          })
        ),
        // TODO: add error alert as soon as Alice&Bob service is ready
        catchError(err => of(loadMoonPayFiatCurrenciesActions.fail(err.message)))
      )
    )
  );

export const buyWithCreditCardEpics = combineEpics<
  Action<string>,
  {
    payload:
      | undefined
      | string
      | { fiat: TopUpInputInterface[]; crypto: TopUpOutputInterface[] }
      | TopUpInputInterface[]
      | TopUpOutputInterface[];
    type: string;
  }
>(loadMoonPayFiatCurrenciesEpic, loadMoonPayCryptoCurrenciesEpic, loadUtorgCurrenciesEpic, loadAliceBobCurrenciesEpic);
