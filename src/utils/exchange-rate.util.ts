import { from, map } from 'rxjs';

import { templeWalletApi, coingeckoApi } from '../api.service';
import { CoingeckoQuoteInterface } from '../interfaces/coingecko-quote.interface';
import { ExchangeRateInterface } from '../interfaces/token-exchange-rate.interface';
import { ExchangeRateRecord } from '../store/currency/currency-state';
import { getTokenSlug } from '../token/utils/token.utils';

export enum FiatCurrenciesEnum {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY',
  AUD = 'AUD',
  CAD = 'CAD',
  CHF = 'CHF',
  CNY = 'CNY',
  DKK = 'DKK',
  HKD = 'HKD',
  IDR = 'IDR',
  INR = 'INR',
  KRW = 'KRW',
  MXN = 'MXN',
  NZD = 'NZD',
  PLN = 'PLN',
  SEK = 'SEK',
  SGD = 'SGD',
  THB = 'THB',
  TRY = 'TRY',
  TWD = 'TWD',
  UAH = 'UAH',
  ZAR = 'ZAR'
}

export const FIAT_CURRENCIES = [
  {
    name: FiatCurrenciesEnum.USD,
    fullname: 'United States Dollar',
    apiLabel: 'usd',
    symbol: '$'
  },
  {
    name: FiatCurrenciesEnum.EUR,
    fullname: 'Euro',
    apiLabel: 'eur',
    symbol: '€'
  },
  {
    name: FiatCurrenciesEnum.GBP,
    fullname: 'British Pound',
    apiLabel: 'gbp',
    symbol: '£'
  },
  {
    name: FiatCurrenciesEnum.JPY,
    fullname: 'Japanese Yen',
    apiLabel: 'jpy',
    symbol: '¥'
  },
  {
    name: FiatCurrenciesEnum.AUD,
    fullname: 'Australian Dollar',
    apiLabel: 'aud',
    symbol: '$'
  },
  {
    name: FiatCurrenciesEnum.CAD,
    fullname: 'Canadian Dollar',
    apiLabel: 'cad',
    symbol: '$'
  },
  {
    name: FiatCurrenciesEnum.CHF,
    fullname: 'Swiss Franc',
    apiLabel: 'chf',
    symbol: 'Fr'
  },
  {
    name: FiatCurrenciesEnum.CNY,
    fullname: 'Chinese Yuan',
    apiLabel: 'cny',
    symbol: '¥'
  },
  {
    name: FiatCurrenciesEnum.DKK,
    fullname: 'Danish Krone',
    apiLabel: 'dkk',
    symbol: 'kr'
  },
  {
    name: FiatCurrenciesEnum.HKD,
    fullname: 'Hong Kong Dollar',
    apiLabel: 'hkd',
    symbol: '$'
  },
  {
    name: FiatCurrenciesEnum.IDR,
    fullname: 'Indonesian Rupiah',
    apiLabel: 'idr',
    symbol: 'Rp'
  },
  {
    name: FiatCurrenciesEnum.INR,
    fullname: 'Indian Rupee',
    apiLabel: 'inr',
    symbol: '₹'
  },
  {
    name: FiatCurrenciesEnum.KRW,
    fullname: 'South Korean Won',
    apiLabel: 'krw',
    symbol: '₩'
  },
  {
    name: FiatCurrenciesEnum.MXN,
    fullname: 'Mexican Peso',
    apiLabel: 'mxn',
    symbol: '$'
  },
  {
    name: FiatCurrenciesEnum.NZD,
    fullname: 'New Zealand Dollar',
    apiLabel: 'nzd',
    symbol: '$'
  },
  {
    name: FiatCurrenciesEnum.PLN,
    fullname: 'Polish Zloty',
    apiLabel: 'pln',
    symbol: 'zł'
  },
  {
    name: FiatCurrenciesEnum.SEK,
    fullname: 'Swedish Krona',
    apiLabel: 'sek',
    symbol: 'kr'
  },
  {
    name: FiatCurrenciesEnum.SGD,
    fullname: 'Singapore Dollar',
    apiLabel: 'sgd',
    symbol: '$'
  },
  {
    name: FiatCurrenciesEnum.THB,
    fullname: 'Thai Baht',
    apiLabel: 'thb',
    symbol: '฿'
  },
  {
    name: FiatCurrenciesEnum.TRY,
    fullname: 'Turkish Lira',
    apiLabel: 'try',
    symbol: '₺'
  },
  {
    name: FiatCurrenciesEnum.TWD,
    fullname: 'Taiwan Dollar',
    apiLabel: 'twd',
    symbol: '$'
  },
  {
    name: FiatCurrenciesEnum.UAH,
    fullname: 'Ukrainian Hryvnia',
    apiLabel: 'uah',
    symbol: '₴'
  },
  {
    name: FiatCurrenciesEnum.ZAR,
    fullname: 'South African Rand',
    apiLabel: 'zar',
    symbol: 'R'
  }
];

export const loadUsdToTokenRates$ = () =>
  from(templeWalletApi.get<Array<ExchangeRateInterface>>('/exchange-rates')).pipe(
    map(payload => {
      const data = payload.data;
      const mappedRates: ExchangeRateRecord = {};

      for (const { tokenAddress, tokenId, exchangeRate } of data) {
        mappedRates[getTokenSlug({ address: tokenAddress, id: tokenId })] = +exchangeRate;
      }

      return mappedRates;
    })
  );

export const loadFiatToTezosRates$ = () =>
  from(
    coingeckoApi.get<CoingeckoQuoteInterface>(
      `/simple/price?ids=tezos&vs_currencies=${FIAT_CURRENCIES.map(({ apiLabel }) => apiLabel).join(',')}`
    )
  ).pipe(
    map(({ data }) => {
      const mappedRates: ExchangeRateRecord = {};
      const tezosData = Object.keys(data.tezos);

      for (const quote of tezosData) {
        mappedRates[quote] = +data.tezos[quote];
      }

      return mappedRates;
    })
  );
