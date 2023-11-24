import { Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';

import { coingeckoApi, templeWalletApi } from '../api.service';
import { MarketTokensSortFieldEnum } from '../enums/market-tokens-sort-field.enum';
import { MarketToken, MarketTokenRaw } from '../store/market/market.interfaces';
import { RootState } from '../store/types';
import { Colors } from '../styles/colors';

import { kFormatter } from './number.util';

const MINIMUM_AMOUNT = 0.01;
const MINIMUM_AMOUNT_DISPLAY = '<0.01';

export const fetchMarketTokens = (ids: string) =>
  coingeckoApi
    .get<Array<MarketTokenRaw>>('coins/markets', {
      params: {
        ids,
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: '100',
        page: '1',
        sparkline: false,
        price_change_percentage: '24h,7d'
      }
    })
    .then(({ data }) =>
      data.map(coinInfo => ({
        id: coinInfo.id,
        name: coinInfo.name,
        symbol: coinInfo.id === 'tezos' ? 'TEZ' : coinInfo.symbol.toUpperCase(),
        imageUrl: coinInfo.image,
        price: coinInfo.current_price,
        priceChange7d: coinInfo?.price_change_percentage_7d_in_currency,
        priceChange24h: coinInfo?.price_change_percentage_24h_in_currency,
        volume24h: coinInfo.total_volume,
        supply: coinInfo.circulating_supply,
        marketCap: coinInfo.market_cap
      }))
    );

export const withTokensIdsToSlugs =
  <T>(state$: Observable<RootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (value, { market }): [T, Record<string, string>] => [value, market.tokensIdsToSlugs.data])
    );

export const getMarketTokensIds = (tokensIdsToSlugs: Record<string, string>) =>
  Object.keys(tokensIdsToSlugs).join(',').concat(',tezos');

export const fetchMarketTokensSlugs = () =>
  templeWalletApi.get<Record<string, string>>('/top-coins').then(value => value.data);

export const formatRegularValue = (value: number | null | undefined, tezosExchangeRate?: number) => {
  const res: { value?: string; valueEstimatedInTezos?: string } = {};

  if (value === null || value === undefined) {
    res.value = '-';

    return res;
  }

  res.value = getValue(value, kFormatter(value));

  if (tezosExchangeRate !== undefined) {
    const valueInTezos = value / tezosExchangeRate;
    res.valueEstimatedInTezos = getValue(valueInTezos, kFormatter(valueInTezos));
  }

  return res;
};

export const formatPrice = (value: number | null | undefined, tezosExchangeRate?: number) => {
  const res: { value?: string; valueEstimatedInTezos?: string } = {};

  if (value === null || value === undefined) {
    res.value = '-';

    return res;
  }

  res.value = getValue(value, value.toLocaleString('en-US', { maximumFractionDigits: 2 }));

  if (tezosExchangeRate !== undefined) {
    const valueInTezos = value / tezosExchangeRate;
    res.valueEstimatedInTezos = getValue(
      valueInTezos,
      valueInTezos.toLocaleString('en-US', { maximumFractionDigits: 2 })
    );
  }

  return res;
};

export const formatPriceChange = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return '-';
  }

  if (value > 0) {
    return `+${value.toFixed(2)}%`;
  } else {
    return `${value.toFixed(2)}%`;
  }
};

export const getPriceChangeColor = (value: number | null | undefined, colors: Colors) => {
  if (value === null || value === undefined || value === 0) {
    return colors.black;
  } else if (value > 0) {
    return colors.adding;
  } else if (value < 0) {
    return colors.destructive;
  }

  return colors.black;
};

const sortByDescending = (a: number | null, b: number | null) => {
  if (a === null) {
    return 1;
  } else if (b === null) {
    return -1;
  } else if (a > b) {
    return -1;
  } else if (a < b) {
    return 1;
  } else {
    return 0;
  }
};

export const sortMarketTokens = (marketTokens: Array<MarketToken>, sortField: MarketTokensSortFieldEnum) => {
  const result = [...marketTokens];

  switch (sortField) {
    case MarketTokensSortFieldEnum.Price:
      return result.sort((a, b) => sortByDescending(a.price, b.price));

    case MarketTokensSortFieldEnum.Volume:
      return result.sort((a, b) => sortByDescending(a.volume24h, b.volume24h));

    case MarketTokensSortFieldEnum.PriceChange:
      return result.sort((a, b) => sortByDescending(a.priceChange24h, b.priceChange24h));

    default:
      return result;
  }
};

const getValue = (comparableValue: number, value: string) =>
  comparableValue < MINIMUM_AMOUNT ? MINIMUM_AMOUNT_DISPLAY : value;
