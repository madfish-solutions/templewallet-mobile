import { createReducer } from '@reduxjs/toolkit';

import { INITIAL_ENTER_WRONG_PASSWORD_ATTEMPTS, MAX_PASSWORD_ATTEMPTS } from '../../config/security';
import { createEntity } from '../create-entity';

import { checkApp, enterPassword } from './security-actions';
import { securityInitialState, SecurityState } from './security-state';

export const securityReducers = createReducer<SecurityState>(securityInitialState, builder => {
  builder.addCase(enterPassword.fail, state => ({
    ...state,
    passwordAttempt: state.passwordAttempt + 1,
    passwordLockTime: state.passwordAttempt >= MAX_PASSWORD_ATTEMPTS ? Date.now() : state.passwordLockTime
  }));
  builder.addCase(enterPassword.success, state => ({
    ...state,
    passwordAttempt: INITIAL_ENTER_WRONG_PASSWORD_ATTEMPTS,
    passwordLockTime: 0
  }));
  builder.addCase(checkApp.submit, state => ({
    ...state,
    isForceUpdateNeeded: createEntity(state.isForceUpdateNeeded.data, true),
    isAppCheckFailed: createEntity(state.isAppCheckFailed.data, true)
  }));
  builder.addCase(checkApp.success, (state, { payload }) => ({
    ...state,
    isForceUpdateNeeded: createEntity(payload.isForceUpdateNeeded),
    isAppCheckFailed: createEntity(payload.isAppCheckFailed)
  }));
  builder.addCase(checkApp.fail, (state, { payload }) => ({
    ...state,
    isForceUpdateNeeded: createEntity(false, false, payload),
    isAppCheckFailed: createEntity(false, false, payload)
  }));
});
