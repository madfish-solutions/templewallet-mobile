import { INITIAL_ENTER_PASSWORD_LOCKTIME, INITIAL_ENTER_WRONG_PASSWORD_ATTEMPTS } from '../../config/security';

export interface SecurityState {
  passwordAttempt: number;
  passwordLockTime: number;
}

export const securityInitialState: SecurityState = {
  passwordAttempt: INITIAL_ENTER_WRONG_PASSWORD_ATTEMPTS,
  passwordLockTime: INITIAL_ENTER_PASSWORD_LOCKTIME
};

export interface SecurityRootState {
  security: SecurityState;
}
