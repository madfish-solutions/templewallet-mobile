import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { MarketCoinsSortFieldEnum } from '../../enums/market-coins-sort-field.enum';
import { MarketRootState } from './market-state';
import { MarketCoin } from './market.interfaces';

const TEZOS_ID = 'tezos';

const useMarketTopCoins = () => useSelector<MarketRootState, Array<MarketCoin>>(state => state.market.tokens.data);

export const useMarketTopCoinsWithoutTez = () => {
  const tokens = useMarketTopCoins();

  return useMemo(() => tokens.filter(token => token.id !== TEZOS_ID), [tokens]);
};

export const useTezosMarketCoin = () => {
  const tokens = useMarketTopCoins();

  return useMemo(() => tokens.find(token => token.id === TEZOS_ID), [tokens]);
};

export const useSortFieldSelector = () =>
  useSelector<MarketRootState, MarketCoinsSortFieldEnum>(state => state.market.sortField);

export const useFavouriteTokens = () =>
  useSelector<MarketRootState, Array<string>>(state => state.market.favouriteTokens);

export const useMarketCoinSlug = (id: string) =>
  useSelector<MarketRootState, string>(state => state.market.tokensSlugs.data[id]);
