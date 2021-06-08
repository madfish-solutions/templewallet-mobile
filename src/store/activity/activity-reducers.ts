import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';
import { loadActivityGroupsActions, pushActivityAction, replaceActivityAction } from './activity-actions';
import { activityInitialState, ActivityState } from './activity-state';

export const activityReducers = createReducer<ActivityState>(activityInitialState, builder => {
  builder.addCase(loadActivityGroupsActions.submit, state => ({
    ...state,
    activityGroups: createEntity([], true)
  }));
  builder.addCase(loadActivityGroupsActions.success, (state, { payload: activityGroups }) => ({
    ...state,
    activityGroups: createEntity(activityGroups, false)
  }));
  builder.addCase(loadActivityGroupsActions.fail, (state, { payload: error }) => ({
    ...state,
    activityGroups: createEntity([], false, error)
  }));

  builder.addCase(pushActivityAction, (state, { payload }) => ({
    ...state,
    activityGroups: {
      ...state.activityGroups,
      data: [payload, ...state.activityGroups.data]
    }
  }));

  builder.addCase(replaceActivityAction, (state, { payload }) => {
    const { data: oldData } = state.activityGroups;
    const oldGroupIndex = oldData.findIndex(group => group[0].hash === payload[0].hash);
    if (oldGroupIndex >= 0) {
      const newData = [...oldData.slice(0, oldGroupIndex), payload, ...oldData.slice(oldGroupIndex + 1)];

      return {
        ...state,
        activityGroups: {
          ...state.activityGroups,
          data: newData
        }
      };
    }

    return state;
  });
});
