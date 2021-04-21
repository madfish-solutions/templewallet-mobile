import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';
import { loadAssetsActions } from './assets-actions';
import { AssetsInitialState, AssetsState } from './assets-state';

export const assetsReducer = createReducer<AssetsState>(AssetsInitialState, builder => {
  builder.addCase(loadAssetsActions.submit, state => ({
    ...state,
    tokens: createEntity([], true)
  }));
  builder.addCase(loadAssetsActions.success, (state, { payload }) => ({
    ...state,
    tokens: createEntity(payload)
  }));
  builder.addCase(loadAssetsActions.fail, (state, { payload }) => ({
    ...state,
    tokens: createEntity([], false, payload)
  }));
});
