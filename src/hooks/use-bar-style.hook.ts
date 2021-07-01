import { StatusBarStyle } from 'react-native';

import { ThemesEnum } from '../interfaces/theme.enum';
import { useThemeSelector } from '../store/display-settings/display-settings-selectors';

export const useBarStyle = () => {
  const theme = useThemeSelector();

  const isDarkTheme = theme === ThemesEnum.dark;

  const lightContent: StatusBarStyle = isDarkTheme ? 'dark-content' : 'light-content';
  const darkContent: StatusBarStyle = isDarkTheme ? 'light-content' : 'dark-content';

  return { lightContent, darkContent };
};
