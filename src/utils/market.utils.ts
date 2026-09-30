import { Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';

import { templeWalletApi } from '../api.service';
import {
  TEZOS_MARKET_TOKEN_ID,
  fetchCoinpaprikaTickersById,
  getCoinpaprikaLogoUrl,
  toCoinpaprikaId
} from '../apis/coinpaprika';
import type { CoinpaprikaTicker } from '../apis/coinpaprika/types';
import { TezosMarket, fetchTezosMarkets } from '../apis/temple-wallet';
import { MarketTokensSortFieldEnum } from '../enums/market-tokens-sort-field.enum';
import { MarketToken } from '../store/market/market.interfaces';
import { RootState } from '../store/types';
import { Colors } from '../styles/colors';
import { TEZ_TOKEN_METADATA, TEZ_TOKEN_SLUG } from '../token/data/tokens-metadata';
import { getTokenSlug } from '../token/utils/token.utils';

import { isDefined } from './is-defined';
import { kFormatter } from './number.util';

const MINIMUM_AMOUNT = 0.01;
const MINIMUM_AMOUNT_DISPLAY = '<0.01';

interface TempleMarketExchangeRate {
  tokenAddress?: string;
  tokenId?: number;
  exchangeRate: string;
  metadata?: {
    name?: string;
    symbol?: string;
  };
}

interface TempleMarketFallback {
  price: number | null;
  name?: string;
  symbol?: string;
}

const toNullableNumber = (value: number | string | null | undefined): number | null => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string' && value !== '') {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const humanizeMarketId = (id: string) =>
  id
    .split('-')
    .filter(Boolean)
    .map(part => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');

interface MarketTokenFields {
  name: string;
  symbol: string;
  imageUrl: string;
  price: number | null;
  priceChange7d: number | null;
  priceChange24h: number | null;
  volume24h: number | null;
  supply: number | null;
  marketCap: number | null;
}

const mapTickerToMarketFields = (ticker: CoinpaprikaTicker): MarketTokenFields => {
  const usdQuote = ticker.quotes?.USD;

  return {
    name: ticker.name,
    symbol: ticker.symbol.toUpperCase(),
    imageUrl: getCoinpaprikaLogoUrl(ticker.id),
    price: toNullableNumber(usdQuote?.price),
    priceChange7d: toNullableNumber(usdQuote?.percent_change_7d),
    priceChange24h: toNullableNumber(usdQuote?.percent_change_24h),
    volume24h: toNullableNumber(usdQuote?.volume_24h),
    supply: toNullableNumber(ticker.circulating_supply) ?? toNullableNumber(ticker.total_supply),
    marketCap: toNullableNumber(usdQuote?.market_cap)
  };
};

const mapTezosMarketToFields = (market: TezosMarket): MarketTokenFields => ({
  name: market.name,
  symbol: market.symbol.toUpperCase(),
  imageUrl: market.image ?? '',
  price: toNullableNumber(market.current_price),
  priceChange7d: toNullableNumber(market.price_change_percentage_7d_in_currency),
  priceChange24h:
    toNullableNumber(market.price_change_percentage_24h_in_currency) ??
    toNullableNumber(market.price_change_percentage_24h),
  volume24h: toNullableNumber(market.total_volume),
  supply: toNullableNumber(market.circulating_supply),
  marketCap: toNullableNumber(market.market_cap)
});

const coinpaprikaTickerHasPrice = (ticker: CoinpaprikaTicker | undefined): ticker is CoinpaprikaTicker =>
  isDefined(ticker) && toNullableNumber(ticker.quotes?.USD?.price) !== null;

const fetchTempleMarketFallbacks = async () => {
  const { data } = await templeWalletApi.get<TempleMarketExchangeRate[]>('/exchange-rates');
  const fallbacksBySlug: StringRecord<TempleMarketFallback> = {};

  for (const item of data) {
    fallbacksBySlug[getTokenSlug({ address: item.tokenAddress, id: item.tokenId })] = {
      price: toNullableNumber(item.exchangeRate),
      name: item.metadata?.name,
      symbol: item.metadata?.symbol
    };
  }

  return fallbacksBySlug;
};

const getMarketTokenStats = (
  ticker: CoinpaprikaTicker | undefined,
  tezosMarket: TezosMarket | undefined
): MarketTokenFields | undefined => {
  if (coinpaprikaTickerHasPrice(ticker)) {
    return mapTickerToMarketFields(ticker);
  }

  if (isDefined(tezosMarket)) {
    return mapTezosMarketToFields(tezosMarket);
  }

  return undefined;
};

const buildMarketToken = (
  marketId: string,
  ticker: CoinpaprikaTicker | undefined,
  tezosMarket: TezosMarket | undefined,
  fallback: TempleMarketFallback | undefined
): MarketToken => {
  const stats = getMarketTokenStats(ticker, tezosMarket);
  const isTezos = marketId === TEZOS_MARKET_TOKEN_ID;
  const name = stats?.name ?? fallback?.name ?? (isTezos ? TEZ_TOKEN_METADATA.name : humanizeMarketId(marketId));
  const symbol = isTezos
    ? TEZ_TOKEN_METADATA.symbol
    : stats?.symbol ?? fallback?.symbol?.toUpperCase() ?? marketId.toUpperCase();

  return {
    id: marketId,
    name,
    symbol,
    imageUrl: stats?.imageUrl ?? '',
    price: stats?.price ?? fallback?.price ?? null,
    priceChange7d: stats?.priceChange7d ?? null,
    priceChange24h: stats?.priceChange24h ?? null,
    volume24h: stats?.volume24h ?? null,
    supply: stats?.supply ?? null,
    marketCap: stats?.marketCap ?? null
  };
};

export const fetchMarketTokens = async (tokensIdsToSlugs: StringRecord): Promise<MarketToken[]> => {
  const topCoinIds = [...Object.keys(tokensIdsToSlugs), TEZOS_MARKET_TOKEN_ID];
  const paprikaIds = [...new Set(topCoinIds.map(id => toCoinpaprikaId(id)))];

  const [tickersById, tezosMarkets, fallbacksBySlug] = await Promise.all([
    fetchCoinpaprikaTickersById(paprikaIds),
    fetchTezosMarkets().catch((): TezosMarket[] => []),
    fetchTempleMarketFallbacks().catch((): StringRecord<TempleMarketFallback> => ({}))
  ]);

  const tezosMarketsById = Object.fromEntries(tezosMarkets.map(market => [market.id, market]));
  const marketIds = [...new Set([...topCoinIds, ...tezosMarkets.map(market => market.id)])];

  return marketIds.map(marketId => {
    const paprikaId = toCoinpaprikaId(marketId);
    const slug = marketId === TEZOS_MARKET_TOKEN_ID ? TEZ_TOKEN_SLUG : tokensIdsToSlugs[marketId];

    return buildMarketToken(
      marketId,
      tickersById[paprikaId],
      tezosMarketsById[marketId],
      slug === undefined ? undefined : fallbacksBySlug[slug]
    );
  });
};

export const withTokensIdsToSlugs =
  <T>(state$: Observable<RootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (value, { market }): [T, StringRecord] => [value, market.tokensIdsToSlugs.data])
    );

export const fetchMarketTokensSlugs = () => templeWalletApi.get<StringRecord>('/top-coins').then(value => value.data);

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
