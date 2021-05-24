import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';
import { loadSelectedBakerAddressActions } from './baking-actions';
import { bakingInitialState, BakingState } from './baking-state';

export const bakingReducers = createReducer<BakingState>(bakingInitialState, builder => {
  builder.addCase(loadSelectedBakerAddressActions.submit, state => ({
    ...state,
    selectedBakerAddress: createEntity(null, true)
  }));
  builder.addCase(loadSelectedBakerAddressActions.success, (state, { payload: address }) => ({
    ...state,
    selectedBakerAddress: createEntity(address, false)
  }));
  builder.addCase(loadSelectedBakerAddressActions.fail, (state, { payload: error }) => ({
    ...state,
    selectedBakerAddress: createEntity(null, false, error)
  }));
});
