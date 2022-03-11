import { createReducer } from '@reduxjs/toolkit';

import {
  addCustomRpc,
  changeTheme,
  setIsBalanceHidden,
  setIsBiometricsEnabled,
  setIsPasscode,
  setIsReinstalled,
  setSelectedRpcUrl
} from './settings-actions';
import { settingsInitialState, SettingsState } from './settings-state';

export const settingsReducers = createReducer<SettingsState>(settingsInitialState, builder => {
  builder.addCase(changeTheme, (state, { payload: theme }) => ({ ...state, theme }));

  builder.addCase(setIsBiometricsEnabled, (state, { payload: isBiometricsEnabled }) => ({
    ...state,
    isBiometricsEnabled
  }));

  builder.addCase(setIsBalanceHidden, (state, { payload: isBalanceHiddenSetting }) => ({
    ...state,
    isBalanceHiddenSetting
  }));

  builder.addCase(addCustomRpc, (state, { payload: customRpc }) => ({
    ...state,
    rpcList: [...state.rpcList, customRpc]
  }));
  builder.addCase(setSelectedRpcUrl, (state, { payload: selectedRpcUrl }) => ({
    ...state,
    selectedRpcUrl
  }));
  builder.addCase(setIsPasscode, (state, { payload: isPasscodeSet }) => ({
    ...state,
    isPasscodeSet
  }));
  builder.addCase(setIsReinstalled.success, state => ({
    ...state,
    isFirstAppLaunch: false
  }));
});
