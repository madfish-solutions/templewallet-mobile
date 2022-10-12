import { createReducer } from '@reduxjs/toolkit';

import { addPendingActivity, removePendingActivity } from './activity-actions';
import { activityInitialState, ActivityState } from './activity-state';

export const activityReducers = createReducer<ActivityState>(activityInitialState, builder => {
  builder.addCase(addPendingActivity, (state, { payload: activity }) => ({
    ...state,
    pendingActivities: [
      ...state.pendingActivities.filter(
        group => activity.length > 0 && group.length > 0 && group[0].hash !== activity[0].hash
      ),
      activity
    ]
  }));
  builder.addCase(removePendingActivity, (state, { payload: activityHash }) => ({
    ...state,
    pendingActivities: state.pendingActivities.filter(
      group => group.length > 0 && group[0].hash.toString() !== activityHash
    )
  }));
});
