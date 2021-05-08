import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { useThemeSelector } from '../store/display-settings/display-settings-selectors';
import { Colors, getColors } from './colors';
import { Typography, typography } from './typography';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

interface CStylesFnProps {
  colors: Colors;
  typography: Typography;
}

export const createUseStyles = <T extends NamedStyles<T>>(
  stylesFn: (props: CStylesFnProps) => T | NamedStyles<T>
) => () => {
  const theme = useThemeSelector();
  const colors = getColors(theme);

  return StyleSheet.create<T>(stylesFn({ colors, typography }));
};
