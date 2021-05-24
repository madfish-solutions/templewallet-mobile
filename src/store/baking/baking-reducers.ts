import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';
import { loadBakersListActions, loadSelectedBakerAddressActions } from './baking-actions';
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

  builder.addCase(loadBakersListActions.submit, state => ({
    ...state,
    bakersList: createEntity([], true)
  }));
  builder.addCase(loadBakersListActions.success, (state, { payload: bakersList }) => ({
    ...state,
    bakersList: createEntity(bakersList, false)
  }));
  builder.addCase(loadBakersListActions.fail, (state, { payload: error }) => ({
    ...state,
    bakersList: createEntity([], false, error)
  }));
});
