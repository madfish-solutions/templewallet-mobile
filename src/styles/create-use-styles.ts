import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { Colors } from './colors';
import { Typography, typography } from './typography';
import { useColors } from './use-colors';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

interface CStylesFnProps {
  colors: Colors;
  typography: Typography;
}

export const createUseStyles = <T extends NamedStyles<T>>(
  stylesFn: (props: CStylesFnProps) => T | NamedStyles<T>
) => () => {
  const colors = useColors();

  return StyleSheet.create<T>(stylesFn({ colors, typography }));
};
