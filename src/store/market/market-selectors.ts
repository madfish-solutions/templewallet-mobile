import { useSelector } from '../selector';

const TEZOS_ID = 'tezos';

export const useMarketTopTokensWithoutTez = () => {
  const tokens = useSelector(state => state.market.tokens.data);

  return tokens.filter(token => token.id !== TEZOS_ID);
};

export const useTezosMarketToken = () => {
  const tokens = useSelector(state => state.market.tokens.data);

  return tokens.find(token => token.id === TEZOS_ID);
};

export const useSortFieldSelector = () => useSelector(state => state.market.sortField);

export const useFavouriteTokensIds = () => useSelector(state => state.market.favouriteTokensIds);

export const useMarketTokenSlug = (id: string) => useSelector(state => state.market.tokensIdsToSlugs.data[id]);
