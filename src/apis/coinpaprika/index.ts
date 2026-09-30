import { coinpaprikaApi } from 'src/api.service';
import { refetchOnce429 } from 'src/apis/utils';

import { COINGECKO_ID_TO_COINPAPRIKA_ID } from './constants';
import type { CoinpaprikaTicker } from './types';

export { TEZOS_MARKET_TOKEN_ID, getCoinpaprikaLogoUrl } from './constants';

const TICKER_QUOTES = { quotes: 'USD' };

const fetchCoinpaprikaTickers = () =>
  refetchOnce429(() =>
    coinpaprikaApi.get<CoinpaprikaTicker[]>('tickers', { params: TICKER_QUOTES }).then(({ data }) => data)
  );

const fetchCoinpaprikaTicker = (coinId: string) =>
  refetchOnce429(() =>
    coinpaprikaApi.get<CoinpaprikaTicker>(`tickers/${coinId}`, { params: TICKER_QUOTES }).then(({ data }) => data)
  );

export const toCoinpaprikaId = (marketId: string) => COINGECKO_ID_TO_COINPAPRIKA_ID[marketId] ?? marketId;

export const fetchCoinpaprikaTickersById = async (requestedIds: string[]) => {
  const tickersById: Record<string, CoinpaprikaTicker> = {};
  let fetchedBulkList = false;

  try {
    const tickers = await fetchCoinpaprikaTickers();
    fetchedBulkList = true;

    for (const ticker of tickers) {
      tickersById[ticker.id] = ticker;
    }
  } catch {
    // Per-coin fetches below cover mapped ids and any bulk-list miss.
  }

  const mappedPaprikaIds = new Set(Object.values(COINGECKO_ID_TO_COINPAPRIKA_ID));
  const missingIds = requestedIds.filter(id => tickersById[id] === undefined);
  const idsToFetch = fetchedBulkList ? missingIds.filter(id => mappedPaprikaIds.has(id)) : missingIds;

  const extraTickers = await Promise.all(idsToFetch.map(id => fetchCoinpaprikaTicker(id).catch(() => undefined)));

  for (const ticker of extraTickers) {
    if (ticker !== undefined) {
      tickersById[ticker.id] = ticker;
    }
  }

  return tickersById;
};
