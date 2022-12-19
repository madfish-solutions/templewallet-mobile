import { useMemo } from 'react';

import { useSelector } from '../selector';

const TEZOS_ID = 'tezos';

const useMarketTopCoins = () => useSelector(state => state.market.tokens.data);

export const useMarketTopCoinsWithoutTez = () => {
  const tokens = useMarketTopCoins();

  return useMemo(() => tokens.filter(token => token.id !== TEZOS_ID), [tokens]);
};

export const useTezosMarketCoin = () => {
  const tokens = useMarketTopCoins();

  return useMemo(() => tokens.find(token => token.id === TEZOS_ID), [tokens]);
};

export const useSortFieldSelector = () => useSelector(state => state.market.sortField);

export const useFavouriteTokensSlugs = () => useSelector(state => state.market.favouriteTokensSlugs);

export const useMarketCoinSlug = (id: string) => useSelector(state => state.market.tokensIdsToSlugs.data[id]);
