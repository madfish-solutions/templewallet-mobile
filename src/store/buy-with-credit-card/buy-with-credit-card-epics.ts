import { combineEpics } from 'redux-observable';
import { catchError, forkJoin, from, map, Observable, of, switchMap } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { fetchMoonpayCryptoCurrencies$, fetchMoonpayFiatCurrencies$ } from 'src/apollo/moonpay';
import { TopUpInputTypeEnum } from 'src/enums/top-up-input-type.enum';
import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { showErrorToast } from 'src/toast/toast.utils';
import { getTezUahPairInfo } from 'src/utils/alice-bob.utils';
import { isDefined } from 'src/utils/is-defined';
import {
  getCurrenciesInfo as getUtorgCurrenciesInfo,
  UTORG_CRYPTO_ICONS_BASE_URL,
  UTORG_FIAT_ICONS_BASE_URL
} from 'src/utils/utorg.utils';

import { createEntity } from '../create-entity';
import { loadAllCurrenciesActions } from './buy-with-credit-card-actions';
import { TopUpProviderCurrencies } from './buy-with-credit-card-state';

const knownUtorgFiatCurrenciesNames: Record<string, string> = {
  PHP: 'Philippine Peso',
  INR: 'Indian Rupee'
};

const getCurrencies$ = <T>(
  fetchFn: () => Observable<T>,
  transformFn: (data: T) => TopUpProviderCurrencies,
  errorMessageFn?: (err: Error) => string
) =>
  fetchFn().pipe(
    map(data => createEntity(transformFn(data))),
    catchError(err => {
      if (isDefined(errorMessageFn)) {
        showErrorToast({ description: errorMessageFn(err) });
      }

      return of(createEntity<TopUpProviderCurrencies>({ fiat: [], crypto: [] }, err.message));
    })
  );

const loadAllCurrenciesEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadAllCurrenciesActions.submit),
    switchMap(() =>
      forkJoin([
        getCurrencies$(
          () => forkJoin([fetchMoonpayFiatCurrencies$(), fetchMoonpayCryptoCurrencies$()]),
          ([fiatCurrencies, cryptoCurrencies]) => ({
            fiat: fiatCurrencies.map(({ name, code, icon, minBuyAmount, maxBuyAmount, precision }) => ({
              name,
              code: code.toUpperCase(),
              network: '',
              networkFullName: '',
              icon,
              minAmount: minBuyAmount,
              maxAmount: maxBuyAmount,
              precision: Math.min(precision, 2), // Currencies like JOD have 3 decimals but Moonpay fails to process input with 3 decimals
              type: TopUpInputTypeEnum.Fiat
            })),
            crypto: cryptoCurrencies
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
          }),
          err => `Failed to load Moonpay currencies: ${err.message}`
        ),
        getCurrencies$(
          () => from(getUtorgCurrenciesInfo()),
          currencies => ({
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
          }),
          err => `Failed to load Utorg currencies: ${err.message}`
        ),
        getCurrencies$(
          () => from(getTezUahPairInfo()),
          ({ minAmount, maxAmount }) => ({
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
        )
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

export const buyWithCreditCardEpics = combineEpics(loadAllCurrenciesEpic);
