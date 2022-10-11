import { createReducer } from '@reduxjs/toolkit';

import { addPendingActivity, removePendingActivity } from './activity-actions';
import { activityInitialState, ActivityState } from './activity-state';

export const activityReducers = createReducer<ActivityState>(activityInitialState, builder => {
  builder.addCase(addPendingActivity, (state, { payload: activity }) => ({
    ...state,
    pendingActivities: [...state.pendingActivities.filter(x => x.id !== activity.id), activity]
  }));
  builder.addCase(removePendingActivity, (state, { payload: activityId }) => ({
    ...state,
    pendingActivities: state.pendingActivities.filter(x => x.id.toString() !== activityId)
  }));
});
