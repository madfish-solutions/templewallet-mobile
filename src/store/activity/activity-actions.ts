import { createAction } from '@reduxjs/toolkit';

import { ActivityGroup } from '../../interfaces/activity.interface';

export const addPendingActivity = createAction<ActivityGroup>('activity/ADD_PENDING_ACTIVITY');

export const removePendingActivity = createAction<string>('activity/REMOVE_PENDING_ACTIVITY');
