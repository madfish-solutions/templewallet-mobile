import { INITIAL_ENTER_PASSWORD_LOCKTIME, INITIAL_ENTER_WRONG_PASSWORD_ATTEMPTS } from '../../config/security';
import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface SecurityState {
  passwordAttempt: number;
  passwordLockTime: number;
  isForceUpdateNeeded: LoadableEntityState<boolean>;
  isAppCheckFailed: LoadableEntityState<boolean>;
}

export const securityInitialState: SecurityState = {
  passwordAttempt: INITIAL_ENTER_WRONG_PASSWORD_ATTEMPTS,
  passwordLockTime: INITIAL_ENTER_PASSWORD_LOCKTIME,
  isForceUpdateNeeded: createEntity(false),
  isAppCheckFailed: createEntity(false)
};
