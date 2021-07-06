import { createAction } from '@reduxjs/toolkit';

import { ActivityGroup } from '../../interfaces/activity.interface';
import { createActions } from '../create-actions';

export const loadActivityGroupsActions = createActions<string, ActivityGroup[], string>(
  'activity/LOAD_ACTIVITY_GROUPS'
);

export const updateActivityGroupsActions = createActions<string, ActivityGroup[], string>(
  'activity/UPDATE_ACTIVITY_GROUPS'
);

export const addPendingOperation = createAction<ActivityGroup>('activity/ADD_PENDING_OPERATIONS');

export const removePendingOperation = createAction<ActivityGroup>('activity/MOVE_OPERATION_TO_READY');
