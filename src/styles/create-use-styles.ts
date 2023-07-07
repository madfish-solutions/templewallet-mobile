import { useMemo } from 'react';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { ButtonStyleConfig } from '../components/button/button-style.config';
import { Colors } from './colors';
import { useTypography } from './typography.context';
import { Typography } from './typography.types';
import { useColors } from './use-colors';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

interface CStylesFnProps {
  colors: Colors;
  typography: Typography;
}

export const createUseStyles =
  <T extends NamedStyles<T>>(stylesFn: (props: CStylesFnProps) => T) =>
  () =>
    StyleSheet.create<T>(createUseStylesConfig(stylesFn)());

export const createUseStylesConfig =
  <T extends NamedStyles<T> = ButtonStyleConfig>(stylesFn: (props: CStylesFnProps) => T) =>
  () => {
    const colors = useColors();
    const typography = useTypography();

    return stylesFn({ colors, typography });
  };

/** Do not use if stylesFn is a hook itself */
export const createUseStylesMemoized = <T extends NamedStyles<T>>(stylesFn: (props: CStylesFnProps) => T) => {
  const useStylesConfig = createUseStylesConfigMemoized(stylesFn);

  return () => {
    const stylesConfig = useStylesConfig();

    return useMemo(() => StyleSheet.create<T>(stylesConfig), [stylesConfig]);
  };
};

/** Do not use if stylesFn is a hook itself */
export const createUseStylesConfigMemoized =
  <T extends NamedStyles<T> = ButtonStyleConfig>(stylesFn: (props: CStylesFnProps) => T) =>
  () => {
    const colors = useColors();
    const typography = useTypography();

    return useMemo(() => stylesFn({ colors, typography }), [colors, typography]);
  };
