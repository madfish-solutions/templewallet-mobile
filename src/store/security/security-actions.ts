import { createActions } from '../create-actions';

export const setPasswordAttempts = createActions<number>('security/SET_PASSWORD_ATTEMPTS');
export const setPasswordTimelock = createActions<number>('security/SET_PASSWORD_TIMELOCK');
