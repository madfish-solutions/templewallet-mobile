import { useEffect } from 'react';
import { StatusBar } from 'react-native';

import { isIOS } from '../../config/system';
import { ThemesEnum } from '../../interfaces/theme.enum';
import { useThemeSelector } from '../../store/display-settings/display-settings-selectors';

export const useStatusBarStyle = () => {
  const theme = useThemeSelector();

  useEffect(() => {
    const isDarkTheme = theme === ThemesEnum.dark;

    StatusBar.setBarStyle(
      isIOS ? (isDarkTheme ? 'light-content' : 'dark-content') : isDarkTheme ? 'dark-content' : 'light-content',
      true
    );
  }, [theme]);
};
