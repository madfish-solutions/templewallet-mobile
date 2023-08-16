import { ThemesEnum } from '../../interfaces/theme.enum';
import { FiatCurrenciesEnum } from '../../utils/exchange-rate.util';
import { RpcList } from '../../utils/rpc/rpc-list';
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
  isEnableAdsBanner: true,
  isOnRampPossibility: false,
  applicationOpenCounter: 1,
  isApkBuildLaunchEventFired: false,
  isPushNotificationsEventFired: false
};
