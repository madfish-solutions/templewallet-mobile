import { createAction } from '@reduxjs/toolkit';

import { ActivityInterface } from '../../interfaces/activity.interface';

export const addPendingActivity = createAction<ActivityInterface>('activity/ADD_PENDING_ACTIVITY');

export const removePendingActivity = createAction<string>('activity/REMOVE_PENDING_ACTIVITY');
