import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';
import { loadSwapDexesAction, loadSwapTokensAction } from './swap-actions';
import { route3InitialState } from './swap-state';

export const swapReducer = createReducer(route3InitialState, builder => {
  builder.addCase(loadSwapTokensAction.submit, state => {
    state.tokens = createEntity([...state.tokens.data], true);
  });
  builder.addCase(loadSwapTokensAction.success, (state, { payload }) => {
    state.tokens = createEntity(payload, false);
  });
  builder.addCase(loadSwapTokensAction.fail, (state, { payload }) => {
    state.tokens = createEntity([], false, payload);
  });
  builder.addCase(loadSwapDexesAction.submit, state => {
    state.dexes = createEntity([...state.dexes.data], true);
  });
  builder.addCase(loadSwapDexesAction.success, (state, { payload }) => {
    state.dexes = createEntity(payload, false);
  });
  builder.addCase(loadSwapDexesAction.fail, (state, { payload }) => {
    state.dexes = createEntity([], false, payload);
  });
});
