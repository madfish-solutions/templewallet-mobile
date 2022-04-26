import { useSelector } from 'react-redux';

import { RpcInterface } from '../../interfaces/rpc.interface';
import { ThemesEnum } from '../../interfaces/theme.enum';
import { SettingsRootState } from './settings-state';

export const useThemeSelector = () => useSelector<SettingsRootState, ThemesEnum>(({ settings }) => settings.theme);

export const useBiometricsEnabledSelector = () =>
  useSelector<SettingsRootState, boolean>(({ settings }) => settings.isBiometricsEnabled);

export const useBalanceHiddenSelector = () =>
  useSelector<SettingsRootState, boolean>(({ settings }) => settings.isBalanceHiddenSetting);

export const useRpcListSelector = () =>
  useSelector<SettingsRootState, RpcInterface[]>(({ settings }) => settings.rpcList);
export const useSelectedRpcUrlSelector = () =>
  useSelector<SettingsRootState, string>(({ settings }) => settings.selectedRpcUrl);

export const useFirstAppLaunchSelector = () =>
  useSelector<SettingsRootState, boolean>(({ settings }) => settings.isFirstAppLaunch);

export const useUserIdSelector = () => useSelector<SettingsRootState, string>(({ settings }) => settings.userId);
