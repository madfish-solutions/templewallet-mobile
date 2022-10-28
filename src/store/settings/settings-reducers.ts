import { createReducer } from '@reduxjs/toolkit';

import { DCP_RPC, OLD_TEMPLE_RPC_URL, TEMPLE_RPC } from '../../utils/rpc/rpc-list';
import { addDcpRpc, changeTempleRpc } from '../migration/migration-actions';
import { resetKeychainOnInstallAction } from '../root-state.actions';
import {
  addCustomRpc,
  changeTheme,
  setFiatCurrency,
  setIsAnalyticsEnabled,
  setIsBalanceHidden,
  setIsBiometricsEnabled,
  setIsDomainAddressShown,
  setIsShowLoaderAction,
  setSelectedRpcUrl,
  setSlippage,
  setZeroBalancesShown,
  toggleDomainAddressShown
} from './settings-actions';
import { settingsInitialState, SettingsState } from './settings-state';

export const settingsReducers = createReducer<SettingsState>(settingsInitialState, builder => {
  builder.addCase(changeTheme, (state, { payload: theme }) => ({ ...state, theme }));

  builder.addCase(setIsShowLoaderAction, (state, { payload: isShowLoader }) => ({ ...state, isShowLoader }));

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

  builder.addCase(changeTempleRpc, state => {
    const oldTempleRpc = state.rpcList.find(rpc => rpc.url === OLD_TEMPLE_RPC_URL);
    const newRpcList = [TEMPLE_RPC, ...state.rpcList.filter(rpc => rpc.url !== OLD_TEMPLE_RPC_URL)];

    if (oldTempleRpc) {
      if (state.selectedRpcUrl === OLD_TEMPLE_RPC_URL) {
        return {
          ...state,
          rpcList: newRpcList,
          selectedRpcUrl: TEMPLE_RPC.url
        };
      }

      return {
        ...state,
        rpcList: newRpcList
      };
    }

    return state;
  });
});
