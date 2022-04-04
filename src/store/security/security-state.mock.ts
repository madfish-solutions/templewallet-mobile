import { INITIAL_ENTER_PASSWORD_LOCKTIME, INITIAL_ENTER_WRONG_PASSWORD_ATTEMPTS } from '../../config/security';
import { SecurityState } from './security-state';

export const mockSecurityState: SecurityState = {
  passwordAttempt: INITIAL_ENTER_WRONG_PASSWORD_ATTEMPTS,
  passwordLockTime: INITIAL_ENTER_PASSWORD_LOCKTIME
};
