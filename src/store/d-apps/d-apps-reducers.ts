import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';
import { loadPermissionsActions, resetAllPermissionsAction } from './d-apps-actions';
import { dAppsInitialState, DAppsState } from './d-apps-state';

export const dAppsReducers = createReducer<DAppsState>(dAppsInitialState, builder => {
  builder.addCase(loadPermissionsActions.submit, state => ({
    ...state,
    permissions: createEntity(state.permissions.data, true)
  }));
  builder.addCase(loadPermissionsActions.success, (state, { payload: permissions }) => ({
    ...state,
    permissions: createEntity(permissions, false)
  }));
  builder.addCase(loadPermissionsActions.fail, (state, { payload: error }) => ({
    ...state,
    permissions: createEntity([], false, error)
  }));
  builder.addCase(resetAllPermissionsAction, state => ({
    ...state,
    permissions: createEntity([], false)
  }));
});
