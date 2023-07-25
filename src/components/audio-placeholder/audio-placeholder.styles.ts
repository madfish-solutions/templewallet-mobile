import { StyleSheet } from 'react-native';

import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useAudioPlaceholderStyles = createUseStyles(({ colors }) => ({
  root: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    borderRadius: formatSize(4),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cardBG
  },
  small: {
    width: formatSize(32),
    height: formatSize(40)
  },
  big: {
    width: formatSize(80),
    height: formatSize(100)
  }
}));
