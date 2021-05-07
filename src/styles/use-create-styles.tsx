import { StyleSheet } from 'react-native';

import { useThemeSelector } from '../store/display-settings/display-settings-selectors';
import { Colors, getColors } from './colors';
import { Typography, typography } from './typography';

interface CreateStylesProps {
  colors: Colors;
  typography: Typography;
}

export function useCreateStyles<T>(callback: (props: CreateStylesProps) => T) {
  const theme = useThemeSelector();
  const colors = getColors(theme);

  const styles = { colors, typography };

  const getStyles = callback(styles);

  return StyleSheet.create<T>(getStyles);
}
