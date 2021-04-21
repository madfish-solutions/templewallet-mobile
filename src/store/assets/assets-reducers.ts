import { createReducer } from '@reduxjs/toolkit';

import { loadAssetsActions } from './assets-actions';
import { AssetsInitialState, AssetsState } from './assets-state';

export const assetsReducer = createReducer<AssetsState>(AssetsInitialState, builder => {
  builder.addCase(loadAssetsActions.submit, state => ({ ...state, isLoading: true }));
  builder.addCase(loadAssetsActions.success, (state, { payload }) => ({
    ...state,
    isLoading: false,
    data: payload || []
  }));
  builder.addCase(loadAssetsActions.fail, (state, { payload }) => ({ ...state, isLoading: false, error: payload }));
});
