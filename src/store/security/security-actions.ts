import { createAction } from '@reduxjs/toolkit';

import { createActions } from '../create-actions';

export const setPasswordLockTime = createAction<number>('security/SET_PASSWORD_LOCK_TIME');
export const enterPassword = createActions('security/ENTER_PASSWORD');
