import { StyleSheet } from 'react-native';

import { black } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useProtectedOverlayStyle = createUseStyles(({ colors, typography }) => ({
  container: {
    ...StyleSheet.absoluteFill,
    borderRadius: formatSize(8),
    overflow: 'hidden'
  },
  protectedBackground: {
    backgroundColor: colors.gray3,
    width: '100%',
    height: '100%'
  },
  touchableOpacity: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    ...typography.body20Bold,
    color: black
  },
  description: {
    ...typography.body17Semibold,
    color: black
  }
}));
