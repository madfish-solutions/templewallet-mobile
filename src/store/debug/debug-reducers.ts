import { createReducer } from '@reduxjs/toolkit';

import { pushRecentAction } from './debug-actions';
import { debugInitialState, DebugState } from './debug-state';

const MAX_RECENT_ACTIONS = 20;

export const debugReducers = createReducer<DebugState>(debugInitialState, builder => {
  builder.addCase(pushRecentAction, (state, { payload }) => ({
    ...state,
    recentActions: [payload, ...state.recentActions.slice(0, MAX_RECENT_ACTIONS - 1)]
  }));
});
