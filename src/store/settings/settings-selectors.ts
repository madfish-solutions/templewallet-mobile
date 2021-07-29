import { useSelector } from 'react-redux';

import { ThemesEnum } from '../../interfaces/theme.enum';
import { SettingsRootState } from './settings-state';

export const useThemeSelector = () => useSelector<SettingsRootState, ThemesEnum>(({ settings }) => settings.theme);

export const useBiometricsEnabledSelector = () =>
  useSelector<SettingsRootState, boolean>(({ settings }) => settings.isBiometricsEnabled);

export const useBalanceHiddenSelector = () =>
  useSelector<SettingsRootState, boolean>(({ settings }) => settings.isBalanceHiddenSetting);
