import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { MarketCoinsSortFieldEnum } from '../../enums/market-coins-sort-field.enum';
import { LoadableEntityState } from '../types';
import { MarketRootState } from './market-state';
import { MarketCoin } from './market.interfaces';

const TEZOS_ID = 'tezos';

export const useMarketTopCoins = () =>
  useSelector<MarketRootState, LoadableEntityState<Array<MarketCoin>>>(state => state.market.tokens);

export const useMarketTopCoinsWithoutTez = () => {
  const tokens = useMarketTopCoins();

  return useMemo(() => tokens.data.filter(token => token.id !== TEZOS_ID), [tokens]);
};

export const useTezosMarketCoin = () => {
  const tokens = useMarketTopCoins();

  return useMemo(() => tokens.data.find(token => token.id === TEZOS_ID), [tokens]);
};

export const useSortFieldSelector = () =>
  useSelector<MarketRootState, MarketCoinsSortFieldEnum>(state => state.market.sortField);
