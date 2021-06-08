import { createAction } from '@reduxjs/toolkit';

import { ActivityGroup } from '../../interfaces/activity.interface';
import { createActions } from '../create-actions';

export const loadActivityGroupsActions = createActions<string, ActivityGroup[], string>(
  'activity/LOAD_ACTIVITY_GROUPS'
);

export const pushActivityAction = createAction<ActivityGroup>('activity/PUSH_ACTIVITY');
export const replaceActivityAction = createAction<ActivityGroup>('activity/REPLACE_ACTIVITY');
