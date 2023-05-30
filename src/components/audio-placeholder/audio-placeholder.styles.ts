import { StyleSheet } from 'react-native';

import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useAudioPlaceholderStyles = createUseStyles(({ colors }) => ({
  card: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    borderRadius: formatSize(4),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cardBG
  },
  container: {
    position: 'relative'
  }
}));
