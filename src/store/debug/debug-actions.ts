import { createAction } from '@reduxjs/toolkit';

import { RecentActionPayload } from '../../interfaces/recent-action-payload.interface';

export const PUSH_RECENT_ACTION_NAME = 'debug/PUSH_RECENT_ACTION';

export const pushRecentAction = createAction<RecentActionPayload>(PUSH_RECENT_ACTION_NAME);
