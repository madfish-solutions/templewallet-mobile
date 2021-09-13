import { ThemesEnum } from '../../interfaces/theme.enum';
import { SettingsState } from './settings-state';

export const mockSettingsState: SettingsState = {
  theme: ThemesEnum.light,
  isBiometricsEnabled: false,
  isBalanceHiddenSetting: false
};
