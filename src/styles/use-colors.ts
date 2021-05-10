import { useThemeSelector } from '../store/display-settings/display-settings-selectors';
import { getColors } from './colors';

export const useColors = () => {
  const theme = useThemeSelector();

  return getColors(theme);
};
