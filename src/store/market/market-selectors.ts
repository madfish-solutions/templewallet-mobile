import { useSelector } from '../selector';

const TEZOS_ID = 'tezos';

export const useMarketTopTokensWithoutTez = () =>
  useSelector(
    state => state.market.tokens.data.filter(token => token.id !== TEZOS_ID),
    (left, right) => JSON.stringify(left) === JSON.stringify(right)
  );

export const useTezosMarketToken = () =>
  useSelector(state => state.market.tokens.data.find(token => token.id === TEZOS_ID));

export const useSortFieldSelector = () => useSelector(state => state.market.sortField);

export const useFavouriteTokensIds = () => useSelector(state => state.market.favouriteTokensIds);

export const useMarketTokenSlug = (id: string) => useSelector(state => state.market.tokensIdsToSlugs.data[id]);
