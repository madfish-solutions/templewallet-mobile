import { createAction } from '@reduxjs/toolkit';

import { ActionArrivalPayload } from '../../interfaces/action-arrival-payload.interface';

export const DEBUG_ACTIONS_NAMES = ['debug/PUSH_ACTION'];

export const pushAction = createAction<ActionArrivalPayload>(DEBUG_ACTIONS_NAMES[0]);
