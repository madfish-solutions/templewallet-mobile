import { TEZOS_MARKET_TOKEN_ID } from 'src/apis/coinpaprika';

import { jsonEqualityFn } from '../../utils/store.utils';
import { useSelector } from '../selector';

export const useMarketTopTokensWithoutTezSelector = () =>
  useSelector(state => state.market.tokens.data.filter(token => token.id !== TEZOS_MARKET_TOKEN_ID), jsonEqualityFn);

export const useTezosMarketTokenSelector = () =>
  useSelector(state => state.market.tokens.data.find(token => token.id === TEZOS_MARKET_TOKEN_ID), jsonEqualityFn);

export const useSortFieldSelector = () => useSelector(state => state.market.sortField);

export const useFavouriteTokensIdsSelector = () => useSelector(state => state.market.favouriteTokensIds);

export const useMarketTokenSlugSelector = (id: string) => useSelector(state => state.market.tokensIdsToSlugs.data[id]);
