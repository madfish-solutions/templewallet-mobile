import { createReducer } from '@reduxjs/toolkit';

import { pushAction } from './debug-actions';
import { debugInitialState, DebugState } from './debug-state';

const MAX_RECENT_EVENTS = 20;

export const debugReducers = createReducer<DebugState>(debugInitialState, builder => {
  builder.addCase(pushAction, (state, { payload }) => ({
    ...state,
    recentActions: [...state.recentActions.slice(-MAX_RECENT_EVENTS + 1), payload]
  }));
});
