import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';
import { loadTokenWhitelist } from './swap-actions';
import { SwapState, swapInitialState } from './swap-state';

export const swapReducers = createReducer<SwapState>(swapInitialState, builder => {
  builder.addCase(loadTokenWhitelist.submit, state => ({
    ...state,
    tokenWhitelist: createEntity(state.tokenWhitelist.data)
  }));
  builder.addCase(loadTokenWhitelist.success, (state, { payload }) => ({
    ...state,
    tokenWhitelist: createEntity(payload)
  }));
  builder.addCase(loadTokenWhitelist.fail, (state, { payload }) => ({
    ...state,
    tokenWhitelist: createEntity(state.tokenWhitelist.data, false, payload)
  }));
});
