import { createReducer } from '@reduxjs/toolkit';

import { setPasswordAttempts, setPasswordTimelock } from './security-actions';
import { securityInitialState, SecurityState } from './security-state';

export const securityReducers = createReducer<SecurityState>(securityInitialState, builder => {
  builder.addCase(setPasswordAttempts, (state, { payload: passwordAttempt }) => ({ ...state, passwordAttempt }));

  builder.addCase(setPasswordTimelock, (state, { payload: passwordTimelock }) => ({
    ...state,
    passwordTimelock
  }));
});
