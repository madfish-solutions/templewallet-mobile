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
export const createUseStylesMemoized =
  <T extends NamedStyles<T>>(stylesFn: (props: CStylesFnProps) => T) =>
  () =>
    StyleSheet.create<T>(createUseStylesConfigMemoized(stylesFn)());

/** Do not use if stylesFn is a hook itself */
const createUseStylesConfigMemoized =
  <T extends NamedStyles<T> = ButtonStyleConfig>(stylesFn: (props: CStylesFnProps) => T) =>
  () => {
    const colors = useColors();

    // TODO: add `typography` dependency as soon as changes from https://github.com/madfish-solutions/templewallet-mobile/pull/834 appear
    return useMemo(() => stylesFn({ colors, typography }), [colors]);
  };
