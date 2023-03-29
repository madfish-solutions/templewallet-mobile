import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';
import { loadSwapDexesAction, loadSwapTokensAction, loadSwapTokensMetadataAction } from './swap-actions';
import { route3InitialState } from './swap-state';

export const swapReducer = createReducer(route3InitialState, builder => {
  builder.addCase(loadSwapTokensAction.submit, state => {
    state.tokens = createEntity([], true);
  });
  builder.addCase(loadSwapTokensAction.success, (state, { payload }) => {
    state.tokens = createEntity(payload, false);
  });
  builder.addCase(loadSwapTokensAction.fail, (state, { payload }) => {
    state.tokens = createEntity([], false, payload);
  });
  builder.addCase(loadSwapTokensMetadataAction.submit, state => {
    state.tokensMetadata = createEntity([], true);
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
});
