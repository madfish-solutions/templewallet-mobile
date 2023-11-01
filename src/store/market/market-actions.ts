import { createAction } from '@reduxjs/toolkit';

import { MarketTokensSortFieldEnum } from '../../enums/market-tokens-sort-field.enum';
import { createActions } from '../create-actions';

import { MarketToken } from './market.interfaces';

export const loadMarketTokensActions = createActions<void, Array<MarketToken>, string>('market/MARKET_TOKENS');

export const loadMarketTokensSlugsActions = createActions<void, Record<string, string>, string>(
  'market/MARKET_TOKENS_SLUGS'
);

export const selectSortValue = createAction<MarketTokensSortFieldEnum>('market/SELECT_SORT_VALUE');

export const addFavouriteToken = createAction<string>('market/ADD_FAVOURITE_TOKEN');
export const deleteFavouriteToken = createAction<string>('market/DELETE_FAVOURITE_TOKEN');
