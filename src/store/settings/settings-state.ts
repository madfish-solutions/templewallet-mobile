import { ThemesEnum } from '../../interfaces/theme.enum';

export interface SettingsState {
  theme: ThemesEnum;
  biometricsEnabled: boolean;
}

export const settingsInitialState: SettingsState = {
  theme: ThemesEnum.light,
  biometricsEnabled: false
};

export interface SettingsRootState {
  settings: SettingsState;
}
