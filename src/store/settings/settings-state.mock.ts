import { ThemesEnum } from '../../interfaces/theme.enum';
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
  slippage: 1.5
};
