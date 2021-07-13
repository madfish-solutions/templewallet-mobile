import { Appearance } from 'react-native';

import { ThemesEnum } from '../../interfaces/theme.enum';

export interface SettingsState {
  theme: ThemesEnum;
  isBiometricsEnabled: boolean;
}

export const settingsInitialState: SettingsState = {
  theme: Appearance.getColorScheme() === 'dark' ? ThemesEnum.dark : ThemesEnum.light,
  isBiometricsEnabled: false
};

export interface SettingsRootState {
  settings: SettingsState;
}
