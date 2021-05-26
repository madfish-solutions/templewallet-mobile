import { useEffect } from 'react';
import { StatusBar } from 'react-native';

import { ThemesEnum } from '../interfaces/theme.enum';
import { useThemeSelector } from '../store/display-settings/display-settings-selectors';

export const useStatusBarStyle = () => {
  const theme = useThemeSelector();

  // TODO: test on Android (maybe need to be inverted)
  useEffect(() => StatusBar.setBarStyle(theme === ThemesEnum.dark ? 'light-content' : 'dark-content', true), [theme]);
};
