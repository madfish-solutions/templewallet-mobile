import { Appearance } from 'react-native';

import { ThemesEnum } from '../../interfaces/theme.enum';

export interface DisplaySettingsState {
  theme: ThemesEnum;
}

export const displaySettingsInitialState: DisplaySettingsState = {
  theme: Appearance.getColorScheme() === 'dark' ? ThemesEnum.dark : ThemesEnum.light
};

export interface DisplaySettingsRootState {
  displaySettings: DisplaySettingsState;
}
