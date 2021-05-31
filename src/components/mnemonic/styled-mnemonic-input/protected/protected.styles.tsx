import { StyleSheet } from 'react-native';

import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useProtectedStyles = createUseStyles(({ colors, typography }) => ({
  protectedImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%'
  },
  protectedView: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    zIndex: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    ...typography.body20Bold,
    color: colors.black,
    marginTop: formatSize(5)
  },
  secondTitle: {
    ...typography.body17Semibold,
    color: colors.black
  }
}));
