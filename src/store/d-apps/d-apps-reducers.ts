import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';
import { loadPeersActions, loadPermissionsActions } from './d-apps-actions';
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
  builder.addCase(loadPeersActions.submit, state => ({
    ...state,
    peers: createEntity(state.peers?.data ?? [], true)
  }));
  builder.addCase(loadPeersActions.success, (state, { payload: peers }) => ({
    ...state,
    peers: createEntity(peers, false)
  }));
  builder.addCase(loadPeersActions.fail, (state, { payload: error }) => ({
    ...state,
    peers: createEntity([], false, error)
  }));
});
