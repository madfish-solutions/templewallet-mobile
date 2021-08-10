import { createReducer } from '@reduxjs/toolkit';

import { pushRecentAction } from './debug-actions';
import { debugInitialState, DebugState } from './debug-state';

const MAX_RECENT_ACTIONS = 20;

export const debugReducers = createReducer<DebugState>(debugInitialState, builder => {
  builder.addCase(pushRecentAction, (state, { payload }) => ({
    ...state,
    recentActions: [...state.recentActions.slice(-MAX_RECENT_ACTIONS + 1), payload]
  }));
});
