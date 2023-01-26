import { createReducer } from '@reduxjs/toolkit';

import { RpcInterface } from 'src/interfaces/rpc.interface';
import { DCP_RPC, OLD_TEMPLE_RPC_URL, TEMPLE_RPC } from 'src/utils/rpc/rpc-list';

import { addDcpRpc, changeTempleRpc } from '../migration/migration-actions';
import { resetKeychainOnInstallAction } from '../root-state.actions';
import {
  addCustomRpc,
  editCustomRpc,
  removeCustomRpc,
  walletOpenedAction,
  changeTheme,
  requestManualBackupAction,
  setFiatCurrency,
  setIsAnalyticsEnabled,
  setIsBalanceHidden,
  setIsBiometricsEnabled,
  setIsDomainAddressShown,
  setIsShowLoaderAction,
  setSelectedRpcUrl,
  setSlippage,
  setZeroBalancesShown,
  toggleDomainAddressShown,
  madeManualBackupAction
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
  builder.addCase(editCustomRpc, (state, { payload: { url, values } }) => void alterCustomRPC(state, url, values));
  builder.addCase(removeCustomRpc, (state, { payload: url }) => void alterCustomRPC(state, url));
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

  builder.addCase(requestManualBackupAction, state => ({
    ...state,
    isManualBackupMade: false
  }));

  builder.addCase(madeManualBackupAction, state => ({
    ...state,
    isManualBackupMade: true
  }));

  builder.addCase(walletOpenedAction, state => ({
    ...state,
    applicationOpenCounter: (state.applicationOpenCounter ?? 0) + 1
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

const alterCustomRPC = (state: SettingsState, url: string, values?: RpcInterface) => {
  if (url === TEMPLE_RPC.url) {
    return;
  }
  const list = state.rpcList;
  const index = list.findIndex(rpc => rpc.url === url);
  if (index < 0) {
    return;
  }
  if (values == null) {
    // 'remove' case
    list.splice(index, 1);
    if (state.selectedRpcUrl === url) {
      state.selectedRpcUrl = state.rpcList[0].url;
    }
  } else {
    // 'edit' case
    list.splice(index, 1, values);
    if (url === state.selectedRpcUrl) {
      state.selectedRpcUrl = values.url;
    }
  }
};
