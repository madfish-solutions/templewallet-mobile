import { Appearance } from 'react-native';

import { RpcInterface } from '../../interfaces/rpc.interface';
import { ThemesEnum } from '../../interfaces/theme.enum';
import { RpcList } from '../../utils/rpc/rpc-list';

export interface SettingsState {
  theme: ThemesEnum;
  isBiometricsEnabled: boolean;
  isBalanceHiddenSetting: boolean;
  rpcList: RpcInterface[];
  selectedRpcUrl: string;
  isFirstAppLaunch: boolean;
}

export const settingsInitialState: SettingsState = {
  theme: Appearance.getColorScheme() === 'dark' ? ThemesEnum.dark : ThemesEnum.light,
  isBiometricsEnabled: false,
  isBalanceHiddenSetting: false,
  rpcList: RpcList,
  selectedRpcUrl: RpcList[0].url,
  isFirstAppLaunch: true
};

export interface SettingsRootState {
  settings: SettingsState;
}
