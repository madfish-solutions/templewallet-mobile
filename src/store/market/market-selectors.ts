import { useSelector } from '../selector';

const TEZOS_ID = 'tezos';

export const useMarketTopTokensWithoutTezSelector = () =>
  useSelector(
    state => state.market.tokens.data.filter(token => token.id !== TEZOS_ID),
    (left, right) => JSON.stringify(left) === JSON.stringify(right)
  );

export const useTezosMarketTokenSelector = () =>
  useSelector(state => state.market.tokens.data.find(token => token.id === TEZOS_ID));

export const useSortFieldSelector = () => useSelector(state => state.market.sortField);

export const useFavouriteTokensIdsSelector = () => useSelector(state => state.market.favouriteTokensIds);

export const useMarketTokenSlugSelector = (id: string) => useSelector(state => state.market.tokensIdsToSlugs.data[id]);
