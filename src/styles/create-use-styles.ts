import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { ButtonStyleConfig } from '../components/button/button-style.config';
import { Colors } from './colors';
import { Typography, typography } from './typography';
import { useColors } from './use-colors';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

interface CStylesFnProps {
  colors: Colors;
  typography: Typography;
}

export const createUseStyles =
  <T extends NamedStyles<T>>(stylesFn: (props: CStylesFnProps) => T | NamedStyles<T>) =>
  () =>
    StyleSheet.create<T>(createUseStylesConfig(stylesFn)());

export const createUseStylesConfig =
  <T extends NamedStyles<T> = ButtonStyleConfig>(stylesFn: (props: CStylesFnProps) => T) =>
  () => {
    const colors = useColors();

    return stylesFn({ colors, typography });
  };
