import { nanoid } from '@reduxjs/toolkit';
import { Appearance } from 'react-native';

import { RpcInterface } from '../../interfaces/rpc.interface';
import { ThemesEnum } from '../../interfaces/theme.enum';
import { FiatCurrenciesEnum } from '../../utils/exchange-rate.util';
import { RpcList } from '../../utils/rpc/rpc-list';

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
  loading: boolean;
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
  slippage: 1.5,
  fiatCurrency: FiatCurrenciesEnum.USD,
  isShownDomainName: false,
  hideZeroBalances: false,
  loading: false
};

export interface SettingsRootState {
  settings: SettingsState;
}
