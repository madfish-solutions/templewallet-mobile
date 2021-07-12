import { Appearance } from 'react-native';

import { ThemesEnum } from '../../interfaces/theme.enum';

export interface SettingsState {
  theme: ThemesEnum;
  biometricsEnabled: boolean;
}

export const settingsInitialState: SettingsState = {
  theme: Appearance.getColorScheme() === 'dark' ? ThemesEnum.dark : ThemesEnum.light,
  biometricsEnabled: false
};

export interface SettingsRootState {
  settings: SettingsState;
}
