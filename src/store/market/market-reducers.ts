import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';
import {
  addFavouriteToken,
  deleteFavouriteToken,
  loadMarketTokensSlugsActions,
  loadMarketTokensActions,
  selectSortValue
} from './market-actions';
import { MarketState, marketInitialState } from './market-state';

export const marketReducers = createReducer<MarketState>(marketInitialState, builer => {
  builer.addCase(loadMarketTokensActions.submit, state => ({
    ...state,
    tokens: createEntity(state.tokens.data, true)
  }));
  builer.addCase(loadMarketTokensActions.success, (state, { payload: tokens }) => ({
    ...state,
    tokens: createEntity(tokens, false)
  }));
  builer.addCase(loadMarketTokensActions.fail, (state, { payload: errorMessage }) => ({
    ...state,
    tokens: createEntity(state.tokens.data, false, errorMessage)
  }));
  builer.addCase(loadMarketTokensSlugsActions.submit, state => ({
    ...state,
    tokensIdsToSlugs: createEntity({}, true)
  }));
  builer.addCase(loadMarketTokensSlugsActions.success, (state, { payload: tokensSlugs }) => ({
    ...state,
    tokensIdsToSlugs: createEntity(tokensSlugs, false)
  }));
  builer.addCase(loadMarketTokensSlugsActions.fail, (state, { payload: errorMessage }) => ({
    ...state,
    tokensIdsToSlugs: createEntity({}, false, errorMessage)
  }));
  builer.addCase(selectSortValue, (state, { payload: sortField }) => ({
    ...state,
    sortField
  }));
  builer.addCase(addFavouriteToken, (state, { payload: tokenId }) => ({
    ...state,
    favouriteTokensIds: [...state.favouriteTokensIds, tokenId]
  }));
  builer.addCase(deleteFavouriteToken, (state, { payload: tokenId }) => ({
    ...state,
    favouriteTokensIds: state.favouriteTokensIds.filter(id => id !== tokenId)
  }));
});
