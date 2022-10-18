import { createReducer } from '@reduxjs/toolkit';

import { isDefined } from '../../utils/is-defined';
import { DCP_RPC, OLD_TEMPLE_RPC_URL, TEMPLE_RPC } from '../../utils/rpc/rpc-list';
import { addDcpRpc, changeTempleRpc, removeGiganodeAction } from '../migration/migration-actions';
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

  builder.addCase(removeGiganodeAction, state => {
    const rpcToRemove = 'https://mainnet-tezos.giganode.io';
    const { rpcList, selectedRpcUrl } = state;
    let newSelectedRpc = rpcToRemove;
    const isMigrationDontNeeded =
      isDefined(rpcList.find(x => x.url === rpcToRemove)) === false && selectedRpcUrl !== rpcToRemove;
    if (isMigrationDontNeeded) {
      return state;
    }
    const newRpcList = rpcList.filter(x => x.url !== rpcToRemove);

    if (selectedRpcUrl === rpcToRemove && newRpcList.length > 0) {
      newSelectedRpc = newRpcList[0].url;
    }

    return {
      ...state,
      selectedRpcUrl: newSelectedRpc,
      rpcList: newRpcList
    };
  });
});
