import { createReducer } from '@reduxjs/toolkit';

import { DCP_RPC } from '../../utils/rpc/rpc-list';
import { updateRpcSettings } from '../migration/migration-actions';
import { resetKeychainOnInstallAction } from '../root-state.actions';
import {
  addCustomRpc,
  changeTheme,
  setFiatCurrency,
  setIsAnalyticsEnabled,
  setIsBalanceHidden,
  setIsBiometricsEnabled,
  setIsDomainAddressShown,
  setSelectedRpcUrl,
  setSlippage,
  setZeroBalancesShown,
  toggleDomainAddressShown
} from './settings-actions';
import { settingsInitialState, SettingsState } from './settings-state';

export const settingsReducers = createReducer<SettingsState>(settingsInitialState, builder => {
  builder.addCase(changeTheme, (state, { payload: theme }) => ({ ...state, theme }));

  builder.addCase(setIsBiometricsEnabled, (state, { payload: isBiometricsEnabled }) => ({
    ...state,
    isBiometricsEnabled
  }));

  builder.addCase(setZeroBalancesShown, (state, { payload: hideZeroBalances }) => ({
    ...state,
    hideZeroBalances
  }));

  builder.addCase(setIsAnalyticsEnabled, (state, { payload: isAnalyticsEnabled }) => ({
    ...state,
    isAnalyticsEnabled
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
  builder.addCase(setFiatCurrency, (state, { payload: fiatCurrency }) => ({
    ...state,
    fiatCurrency
  }));
  builder.addCase(resetKeychainOnInstallAction.success, state => ({
    ...state,
    isFirstAppLaunch: false
  }));
  builder.addCase(setSlippage, (state, { payload: slippage }) => ({
    ...state,
    slippage
  }));

  builder.addCase(toggleDomainAddressShown, state => ({
    ...state,
    isShownDomainName: !state.isShownDomainName
  }));
  builder.addCase(setIsDomainAddressShown, (state, { payload: isShownDomainName }) => ({
    ...state,
    isShownDomainName
  }));

  // MIGRATIONS
  builder.addCase(updateRpcSettings, state => {
    const rpcTzBetaUrl = 'https://rpc.tzbeta.net';
    const isMigrationTzBeta = state.rpcList.find(rpc => rpc.url === rpcTzBetaUrl) !== undefined;
    const isMigrationDcp = state.rpcList.find(rpc => rpc.url === DCP_RPC.url) === undefined;

    const rpcList = state.rpcList.filter(x => (isMigrationTzBeta ? x.url !== rpcTzBetaUrl : true));

    return {
      ...state,
      selectedRpcUrl:
        isMigrationTzBeta && state.selectedRpcUrl === rpcTzBetaUrl ? rpcList[0].url : state.selectedRpcUrl,
      rpcList: isMigrationDcp ? [...rpcList, DCP_RPC] : rpcList
    };
  });
});
