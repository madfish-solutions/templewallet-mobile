import { createReducer } from '@reduxjs/toolkit';

import { DCP_RPC } from 'src/utils/rpc/rpc-list';

import { resetKeychainOnInstallAction } from '../root-state.actions';

import {
  addCustomRpc,
  editCustomRpc,
  removeCustomRpc,
  walletOpenedAction,
  changeTheme,
  requestSeedPhraseBackupAction,
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
  madeManualBackupAction,
  madeCloudBackupAction,
  setOnRampOverlayStateAction,
  setIsOnRampHasBeenShownBeforeAction,
  setIsApkBuildLaunchEventFired,
  setIsPushNotificationsEnabledEventFired,
  switchIsShowCollectibleInfoAction,
  setIsInAppUpdateAvailableAction
} from './settings-actions';
import { SettingsState, settingsInitialState } from './settings-state';
import { alterCustomRPC } from './utils';

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

  builder.addCase(setIsApkBuildLaunchEventFired, (state, { payload: isApkBuildLaunchEventFired }) => ({
    ...state,
    isApkBuildLaunchEventFired
  }));

  builder.addCase(
    setIsPushNotificationsEnabledEventFired,
    (state, { payload: isPushNotificationsEnabledEventFired }) => ({
      ...state,
      isPushNotificationsEnabledEventFired
    })
  );

  builder.addCase(requestSeedPhraseBackupAction, state => ({
    ...state,
    isManualBackupMade: false,
    isCloudBackupMade: false
  }));

  builder.addCase(madeManualBackupAction, state => ({
    ...state,
    isManualBackupMade: true
  }));

  builder.addCase(madeCloudBackupAction, state => ({
    ...state,
    isCloudBackupMade: true
  }));

  builder.addCase(switchIsShowCollectibleInfoAction, state => ({
    ...state,
    isShowCollectibleInfo: !state.isShowCollectibleInfo
  }));

  builder.addCase(setOnRampOverlayStateAction, (state, { payload: onRampOverlayState }) => {
    if (state.selectedRpcUrl !== DCP_RPC.url) {
      return { ...state, onRampOverlayState };
    }

    return state;
  });
  builder.addCase(setIsOnRampHasBeenShownBeforeAction, (state, { payload: isOnRampHasBeenShownBefore }) => ({
    ...state,
    isOnRampHasBeenShownBefore
  }));

  builder.addCase(walletOpenedAction, state => ({
    ...state,
    applicationOpenCounter: (state.applicationOpenCounter ?? 0) + 1
  }));

  builder.addCase(setIsInAppUpdateAvailableAction, (state, { payload }) => ({
    ...state,
    isInAppUpdateAvailable: payload
  }));
});
