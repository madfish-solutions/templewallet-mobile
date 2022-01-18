import { StyleSheet } from 'react-native';

import { black } from '../../../config/styles';
import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useProtectedOverlayStyle = createUseStyles(({ colors, typography }) => ({
  container: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: formatSize(8),
    overflow: 'hidden'
  },
  protectedBackground: {
    backgroundColor: colors.gray3,
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
    color: black
  },
  description: {
    ...typography.body17Semibold,
    color: black
  }
}));
