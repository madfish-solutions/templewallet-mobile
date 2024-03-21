import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { ThemesEnum } from 'src/interfaces/theme.enum';
import { FiatCurrenciesEnum } from 'src/utils/exchange-rate.util';
import { RpcList } from 'src/utils/rpc/rpc-list';

import { SettingsState } from './settings-state';

export const mockSettingsState: SettingsState = {
  theme: ThemesEnum.light,
  isBiometricsEnabled: false,
  isAnalyticsEnabled: true,
  isBalanceHiddenSetting: false,
  rpcList: RpcList,
  selectedRpcUrl: RpcList[0].url,
  isFirstAppLaunch: true,
  userId: '0',
  slippage: 1.5,
  fiatCurrency: FiatCurrenciesEnum.USD,
  isShownDomainName: false,
  hideZeroBalances: false,
  isShowLoader: false,
  isManualBackupMade: true,
  isCloudBackupMade: true,
  startModalAllowed: false,
  onRampOverlayState: OnRampOverlayState.Closed,
  applicationOpenCounter: 1,
  isOnRampHasBeenShownBefore: false,
  isApkBuildLaunchEventFired: false,
  isPushNotificationsEnabledEventFired: false,
  isShowCollectibleInfo: false,
  isInAppUpdateAvailable: false
};
