import { useCallback } from 'react';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { useThemeSelector } from '../store/display-settings/display-settings-selectors';
import { Colors, getColors } from './colors';
import { Typography, typography } from './typography';

interface CreateStylesProps {
  colors: Colors;
  typography: Typography;
}

interface Styles {
  [key: string]: ViewStyle | TextStyle | ImageStyle;
}

export const useCreateStyles = (callback: (props: CreateStylesProps) => Styles) => {
  const theme = useThemeSelector();
  const colors = getColors(theme);

  const styles = { colors, typography };

  const getStyles = callback(styles);

  return useCallback((): Styles => StyleSheet.create<Styles>(getStyles), [getStyles]);
};
