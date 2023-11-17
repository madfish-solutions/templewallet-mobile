import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';

import { loadTokensApyActions, loadDAppsListActions, loadPermissionsActions } from './d-apps-actions';
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

  builder.addCase(loadDAppsListActions.submit, state => ({
    ...state,
    dappsList: createEntity(state.dappsList.data, true)
  }));
  builder.addCase(loadDAppsListActions.success, (state, { payload: dappsList }) => ({
    ...state,
    dappsList: createEntity(dappsList, false)
  }));
  builder.addCase(loadDAppsListActions.fail, (state, { payload: error }) => ({
    ...state,
    dappsList: createEntity([], false, error)
  }));
  builder.addCase(loadTokensApyActions.success, (state, { payload: loadedRates }) => {
    const tokensApyRates = { ...state.tokensApyRates, ...loadedRates };

    return { ...state, tokensApyRates };
  });
});
