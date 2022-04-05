import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';
import { checkApp } from './app-check-actions';
import { appCheckInitialState, AppCheckState } from './app-check-state';

export const appCheckReducers = createReducer<AppCheckState>(appCheckInitialState, builder => {
  builder.addCase(checkApp.submit, state => ({
    ...state,
    checkInfo: createEntity(state.checkInfo.data, true)
  }));
  builder.addCase(checkApp.success, (state, { payload }) => ({
    ...state,
    checkInfo: createEntity(payload)
  }));
  builder.addCase(checkApp.fail, (state, { payload }) => ({
    ...state,
    checkInfo: createEntity(state.checkInfo.data, false, payload)
  }));
});
