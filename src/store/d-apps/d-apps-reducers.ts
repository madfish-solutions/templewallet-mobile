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
  builder.addCase(loadTokensApyActions.success, (state, { payload: apyRecords }) => {
    const slugs = Object.keys(apyRecords);
    const tokensApy = slugs.reduce(
      (acc, slug) => ({
        ...acc,
        [slug]: {
          ...state.tokensApyInfo[slug],
          rate: apyRecords[slug]
        }
      }),
      {}
    );

    return { ...state, tokensApyInfo: { ...state.tokensApyInfo, ...tokensApy } };
  });
});
