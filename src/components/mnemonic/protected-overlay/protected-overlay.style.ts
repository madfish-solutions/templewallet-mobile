import { StyleSheet } from 'react-native';

import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useProtectedOverlayStyle = createUseStyles(({ colors, typography }) => ({
  container: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: formatSize(8),
    overflow: 'hidden'
  },
  protectedBackground: {
    width: '100%',
    height: '100%'
  },
  touchableOpacity: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    ...typography.body20Bold,
    color: colors.black
  },
  description: {
    ...typography.body17Semibold,
    color: colors.black
  }
}));
