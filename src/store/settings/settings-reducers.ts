import { createReducer } from '@reduxjs/toolkit';

import { DCP_RPC } from '../../utils/rpc/rpc-list';
import { addDcpRpc, removeTzBetaRpc } from '../migration/migration-actions';
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

const TZBETA_RPC_URL = 'https://rpc.tzbeta.net';

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
  builder.addCase(addDcpRpc, state => {
    const isMigrationNeeded = state.rpcList.find(rpc => rpc.url === DCP_RPC.url) === undefined;

    if (isMigrationNeeded) {
      return {
        ...state,
        rpcList: [...state.rpcList, DCP_RPC]
      };
    }

    return state;
  });
  builder.addCase(removeTzBetaRpc, state => {
    const isMigrationTzBeta = state.rpcList.find(rpc => rpc.url === TZBETA_RPC_URL) !== undefined;

    const rpcList = state.rpcList.filter(x => (isMigrationTzBeta ? x.url !== TZBETA_RPC_URL : true));

    return {
      ...state,
      selectedRpcUrl:
        isMigrationTzBeta && state.selectedRpcUrl === TZBETA_RPC_URL ? rpcList[0].url : state.selectedRpcUrl,
      rpcList
    };
  });
});
