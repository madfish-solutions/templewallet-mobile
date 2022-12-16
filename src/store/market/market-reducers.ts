import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';
import {
  addFavouriteToken,
  deleteFavouriteToken,
  loadMarketCoinsSlugsActions,
  loadMarketTopCoinsActions,
  selectSortValue
} from './market-actions';
import { MarketState, marketInitialState } from './market-state';

export const marketReducers = createReducer<MarketState>(marketInitialState, builer => {
  builer.addCase(loadMarketTopCoinsActions.submit, state => ({
    ...state,
    tokens: createEntity(state.tokens.data, true)
  }));
  builer.addCase(loadMarketTopCoinsActions.success, (state, { payload: tokens }) => ({
    ...state,
    tokens: createEntity(tokens, false)
  }));
  builer.addCase(loadMarketTopCoinsActions.fail, (state, { payload: errorMessage }) => ({
    ...state,
    tokens: createEntity([], false, errorMessage)
  }));
  builer.addCase(loadMarketCoinsSlugsActions.submit, state => ({
    ...state,
    tokensSlugs: createEntity(state.tokensIdsToSlugs.data, true)
  }));
  builer.addCase(loadMarketCoinsSlugsActions.success, (state, { payload: tokensSlugs }) => ({
    ...state,
    tokensSlugs: createEntity(tokensSlugs, false)
  }));
  builer.addCase(loadMarketCoinsSlugsActions.fail, (state, { payload: errorMessage }) => ({
    ...state,
    tokensSlugs: createEntity({}, false, errorMessage)
  }));
  builer.addCase(selectSortValue, (state, { payload: sortField }) => ({
    ...state,
    sortField
  }));
  builer.addCase(addFavouriteToken, (state, { payload: tokenSlug }) => ({
    ...state,
    favouriteTokens: [...state.favouriteTokensSlugs, tokenSlug]
  }));
  builer.addCase(deleteFavouriteToken, (state, { payload: tokenSlug }) => ({
    ...state,
    favouriteTokens: state.favouriteTokensSlugs.filter(slug => slug !== tokenSlug)
  }));
});
