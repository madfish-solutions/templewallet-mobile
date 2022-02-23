import { createAction } from '@reduxjs/toolkit';

export const setPasswordAttempts = createAction<number>('security/SET_PASSWORD_ATTEMPTS');
export const setPasswordTimelock = createAction<number>('security/SET_PASSWORD_TIMELOCK');
