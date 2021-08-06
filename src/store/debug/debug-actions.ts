import { createAction } from '@reduxjs/toolkit';

import { ActionArrivalPayload } from '../../interfaces/action-arrival-payload.interface';

export const PUSH_ACTION_NAME = 'debug/PUSH_ACTION';

export const pushAction = createAction<ActionArrivalPayload>(PUSH_ACTION_NAME);
