import { createReducer } from '@reduxjs/toolkit';

import { INITIAL_ENTER_WRONG_PASSWORD_ATTEMPTS, MAX_PASSWORD_ATTEMPTS } from '../../config/security';
import { enterPassword, setPasswordLockTime } from './security-actions';
import { securityInitialState, SecurityState } from './security-state';

export const securityReducers = createReducer<SecurityState>(securityInitialState, builder => {
  builder.addCase(enterPassword.fail, state => ({
    ...state,
    passwordAttempt: state.passwordAttempt < MAX_PASSWORD_ATTEMPTS ? state.passwordAttempt + 1 : state.passwordAttempt
  }));
  builder.addCase(enterPassword.success, state => ({
    ...state,
    passwordAttempt: INITIAL_ENTER_WRONG_PASSWORD_ATTEMPTS
  }));

  builder.addCase(setPasswordLockTime, (state, { payload: passwordLockTime }) => ({
    ...state,
    passwordLockTime
  }));
});
