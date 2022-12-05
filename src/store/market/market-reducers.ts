import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';
import { loadMarketTopCoinsActions } from './market-actions';
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
});
