import { useContext } from 'react';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { ButtonStyleConfig } from '../components/button/button-style.config';
import { CurrentRouteNameContext } from '../navigator/current-route-name.context';
import { isDefined } from '../utils/is-defined';
import { Colors } from './colors';
import { useOverloadedColors } from './overloaded-colors';
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
    const currentRouteName = useContext(CurrentRouteNameContext);
    const colors = useOverloadedColors();
    const fallbackColors = useColors();

    return stylesFn({
      colors: isDefined(colors[currentRouteName]) ? colors[currentRouteName] : fallbackColors,
      typography
    });
  };
