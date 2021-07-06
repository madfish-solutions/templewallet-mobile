import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';
import {
  addPendingOperation,
  loadActivityGroupsActions,
  removePendingOperation,
  updateActivityGroupsActions
} from './activity-actions';
import { activityInitialState, ActivityState } from './activity-state';

export const activityReducers = createReducer<ActivityState>(activityInitialState, builder => {
  builder.addCase(loadActivityGroupsActions.submit, state => ({
    ...state,
    activityGroups: createEntity(state.activityGroups.data, true)
  }));
  builder.addCase(loadActivityGroupsActions.success, (state, { payload: activityGroups }) => ({
    ...state,
    activityGroups: createEntity(activityGroups, false)
  }));
  builder.addCase(loadActivityGroupsActions.fail, (state, { payload: error }) => ({
    ...state,
    activityGroups: createEntity([], false, error)
  }));
  builder.addCase(addPendingOperation, (state, { payload }) => ({
    ...state,
    pendingOperations: [payload, ...(state.pendingOperations ?? [])]
  }));
  builder.addCase(removePendingOperation, ({ pendingOperations, ...restState }, { payload }) => ({
    ...restState,
    pendingOperations: pendingOperations.filter(group => group[0].hash !== payload[0].hash)
  }));
  builder.addCase(updateActivityGroupsActions.submit, state => ({
    ...state,
    activityGroups: createEntity(state.activityGroups.data, true)
  }));
  builder.addCase(updateActivityGroupsActions.success, (state, { payload }) => ({
    ...state,
    activityGroups: createEntity([...payload, ...state.activityGroups.data], false)
  }));
  builder.addCase(updateActivityGroupsActions.fail, (state, { payload: error }) => ({
    ...state,
    activityGroups: createEntity(state.activityGroups.data, false, error)
  }));
});
