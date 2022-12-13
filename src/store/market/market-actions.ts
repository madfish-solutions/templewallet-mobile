import { createAction } from '@reduxjs/toolkit';

import { MarketCoinsSortFieldEnum } from '../../enums/market-coins-sort-field.enum';
import { createActions } from '../create-actions';
import { MarketCoin } from './market.interfaces';

export const loadMarketTopCoinsActions = createActions<void, Array<MarketCoin>, string>('market/MARKET_TOP_COINS');

export const loadMarketCoinsSlugsActions = createActions<void, Record<string, string>, string>(
  'market/MARKET_TOP_COINS_SLUGS'
);

export const selectSortValue = createAction<MarketCoinsSortFieldEnum>('market/SELECT_SORT_VALUE');

export const addFavouriteToken = createAction<string>('market/ADD_FAVOURITE_TOKEN');
export const deleteFavouriteToken = createAction<string>('market/DELETE_FAVOURITE_TOKEN');
