import { nanoid } from '@reduxjs/toolkit';
import { Appearance } from 'react-native';

import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { RpcInterface } from 'src/interfaces/rpc.interface';
import { ThemesEnum } from 'src/interfaces/theme.enum';
import { FiatCurrenciesEnum } from 'src/utils/exchange-rate.util';
import { RpcList } from 'src/utils/rpc/rpc-list';

export interface SettingsState {
  theme: ThemesEnum;
  isBiometricsEnabled: boolean;
  isAnalyticsEnabled: boolean;
  isBalanceHiddenSetting: boolean;
  rpcList: RpcInterface[];
  selectedRpcUrl: string;
  isFirstAppLaunch: boolean;
  userId: string;
  slippage: number;
  fiatCurrency: FiatCurrenciesEnum;
  isShownDomainName: boolean;
  hideZeroBalances: boolean;
  isShowLoader: boolean;
  isManualBackupMade: boolean;
  isCloudBackupMade: boolean;
  onRampOverlayState: OnRampOverlayState;
  isOnRampHasBeenShownBefore: boolean;
  applicationOpenCounter: number;
  /** @deprecated */
  isEnableAdsBanner?: boolean;
  isApkBuildLaunchEventFired: boolean;
  isPushNotificationsEnabledEventFired: boolean;
  isShowCollectibleInfo: boolean;
  isInAppUpdateAvailable: boolean;
}

export const settingsInitialState: SettingsState = {
  theme: Appearance.getColorScheme() === 'dark' ? ThemesEnum.dark : ThemesEnum.light,
  isBiometricsEnabled: false,
  isAnalyticsEnabled: true,
  isBalanceHiddenSetting: false,
  rpcList: RpcList,
  selectedRpcUrl: RpcList[0].url,
  isFirstAppLaunch: true,
  userId: nanoid(),
  slippage: 0.25,
  fiatCurrency: FiatCurrenciesEnum.USD,
  isShownDomainName: false,
  hideZeroBalances: false,
  isShowLoader: false,
  isManualBackupMade: true,
  isCloudBackupMade: true,
  applicationOpenCounter: 0,
  onRampOverlayState: OnRampOverlayState.Closed,
  isOnRampHasBeenShownBefore: false,
  isApkBuildLaunchEventFired: false,
  isPushNotificationsEnabledEventFired: false,
  isShowCollectibleInfo: false,
  isInAppUpdateAvailable: false
};
