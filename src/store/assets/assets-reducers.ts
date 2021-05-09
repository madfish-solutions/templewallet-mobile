import { createReducer } from '@reduxjs/toolkit';
import { BigNumber } from 'bignumber.js';

import { createEntity } from '../create-entity';
import { loadTezosAssetsActions, loadTokenAssetsActions } from './assets-actions';
import { AssetsInitialState, AssetsState } from './assets-state';

export const assetsReducer = createReducer<AssetsState>(AssetsInitialState, builder => {
  builder.addCase(loadTokenAssetsActions.submit, state => ({
    ...state,
    tokens: createEntity([], true)
  }));
  builder.addCase(loadTokenAssetsActions.success, (state, { payload }) => ({
    ...state,
    tokens: createEntity(payload)
  }));
  builder.addCase(loadTokenAssetsActions.fail, (state, { payload }) => ({
    ...state,
    tokens: createEntity([], false, payload)
  }));
  builder.addCase(loadTezosAssetsActions.submit, state => ({
    ...state,
    tezos: createEntity(new BigNumber(0), true)
  }));
  builder.addCase(loadTezosAssetsActions.success, (state, { payload }) => ({
    ...state,
    tezos: createEntity(payload, false)
  }));
  builder.addCase(loadTezosAssetsActions.fail, (state, { payload }) => ({
    ...state,
    tezos: createEntity(new BigNumber(0), false, payload)
  }));
});
