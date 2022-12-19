import { useMemo } from 'react';

import { useSelector } from '../selector';

const TEZOS_ID = 'tezos';

const useMarketTopTokens = () => useSelector(state => state.market.tokens.data);

export const useMarketTopTokensWithoutTez = () => {
  const tokens = useMarketTopTokens();

  return useMemo(() => tokens.filter(token => token.id !== TEZOS_ID), [tokens]);
};

export const useTezosMarketToken = () => {
  const tokens = useMarketTopTokens();

  return useMemo(() => tokens.find(token => token.id === TEZOS_ID), [tokens]);
};

export const useSortFieldSelector = () => useSelector(state => state.market.sortField);

export const useFavouriteTokensIds = () => useSelector(state => state.market.favouriteTokensIds);

export const useMarketTokenSlug = (id: string) => useSelector(state => state.market.tokensIdsToSlugs.data[id]);
