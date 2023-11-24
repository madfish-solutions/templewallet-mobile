import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';

import {
  loadSwapDexesAction,
  loadSwapParamsAction,
  loadSwapTokensAction,
  loadSwapTokensMetadataAction,
  resetSwapParamsAction
} from './swap-actions';
import { route3InitialState } from './swap-state';
import { DEFAULT_SWAP_PARAMS } from './swap-state.mock';

export const swapReducer = createReducer(route3InitialState, builder => {
  builder.addCase(loadSwapTokensAction.submit, state => {
    state.tokens = createEntity([], true);
    state.tokensMetadata = createEntity([], true);
  });
  builder.addCase(loadSwapTokensAction.success, (state, { payload }) => {
    state.tokens = createEntity(payload, false);
  });
  builder.addCase(loadSwapTokensAction.fail, (state, { payload }) => {
    state.tokens = createEntity([], false, payload);
  });
  builder.addCase(loadSwapTokensMetadataAction.success, (state, { payload }) => {
    state.tokensMetadata = createEntity(payload, false);
  });
  builder.addCase(loadSwapTokensMetadataAction.fail, (state, { payload }) => {
    state.tokensMetadata = createEntity([], false, payload);
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
  builder.addCase(resetSwapParamsAction, state => {
    state.swapParams = createEntity(DEFAULT_SWAP_PARAMS);
  });
  builder.addCase(loadSwapParamsAction.submit, state => {
    state.swapParams = createEntity(DEFAULT_SWAP_PARAMS, true);
  });
  builder.addCase(loadSwapParamsAction.success, (state, { payload }) => {
    state.swapParams = createEntity(payload, false);
  });
  builder.addCase(loadSwapParamsAction.fail, (state, { payload }) => {
    state.swapParams = createEntity(DEFAULT_SWAP_PARAMS, false, payload);
  });
});
