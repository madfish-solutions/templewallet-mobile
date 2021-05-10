import { ThemesEnum } from '../../interfaces/theme.enum';

export interface DisplaySettingsState {
  theme: ThemesEnum;
}

export const displaySettingsInitialState: DisplaySettingsState = {
  theme: ThemesEnum.dark
};

export interface DisplaySettingsRootState {
  displaySettings: DisplaySettingsState;
}
