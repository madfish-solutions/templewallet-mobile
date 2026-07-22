import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';

import { loadTkeyRewardsStatsActions } from './rewards-actions';
import { rewardsInitialState, RewardsState } from './rewards-state';

export const rewardsReducer = createReducer<RewardsState>(rewardsInitialState, builder => {
  builder.addCase(loadTkeyRewardsStatsActions.submit, state => {
    state.tkeyStats = createEntity(state.tkeyStats.data, true);
  });
  builder.addCase(loadTkeyRewardsStatsActions.success, (state, { payload: stats }) => {
    state.tkeyStats = createEntity(stats, false);
  });
  builder.addCase(loadTkeyRewardsStatsActions.fail, (state, { payload: error }) => {
    state.tkeyStats = createEntity(state.tkeyStats.data, false, error);
  });
});
