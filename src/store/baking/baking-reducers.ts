import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';

import { loadBakerRewardsListActions, loadBakersListActions, loadSelectedBakerActions } from './baking-actions';
import { bakingInitialState, BakingState } from './baking-state';

export const bakingReducers = createReducer<BakingState>(bakingInitialState, builder => {
  builder.addCase(loadSelectedBakerActions.success, (state, { payload: selectedBaker }) => {
    if (selectedBaker) {
      state.selectedBaker = selectedBaker;
    } else {
      delete state.selectedBaker;
    }
  });

  builder.addCase(loadBakersListActions.submit, state => ({
    ...state,
    bakersList: createEntity(state.bakersList.data, true)
  }));
  builder.addCase(loadBakersListActions.success, (state, { payload: bakersList }) => ({
    ...state,
    bakersList: createEntity(bakersList, false)
  }));
  builder.addCase(loadBakersListActions.fail, (state, { payload: error }) => ({
    ...state,
    bakersList: createEntity([], false, error)
  }));
  builder.addCase(loadBakerRewardsListActions.submit, state => ({
    ...state,
    bakerRewardsList: createEntity(state.bakerRewardsList.data, true)
  }));
  builder.addCase(loadBakerRewardsListActions.success, (state, { payload: bakerRewards }) => ({
    ...state,
    bakerRewardsList: createEntity(bakerRewards, false)
  }));
  builder.addCase(loadBakerRewardsListActions.fail, (state, { payload: error }) => ({
    ...state,
    bakerRewardsList: createEntity([], false, error)
  }));
});
