import { StyleSheet } from 'react-native';

import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useHeaderProgressStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    alignItems: 'center'
  },
  text: {
    ...typography.caption13Semibold,
    color: colors.gray1
  },
  progressContainer: {
    position: 'relative',
    height: formatSize(4),
    borderRadius: formatSize(4),
    backgroundColor: colors.lines
  },
  progressLine: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: formatSize(4),
    backgroundColor: colors.black
  }
}));
