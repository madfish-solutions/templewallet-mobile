import { StyleSheet } from 'react-native';

import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const usePassCodeStyles = createUseStyles(({ typography, colors }) => ({
  root: {
    ...StyleSheet.absoluteFillObject
  },
  container: {
    marginTop: formatSize(108),
    alignSelf: 'flex-start'
  },
  iconContainer: {
    alignItems: 'center'
  },
  header: {
    ...typography.body20Bold,
    color: colors.black,
    textAlign: 'center',
    textTransform: 'none'
  },
  description: {
    ...typography.caption11Regular,
    color: colors.black,
    textAlign: 'center',
    textTransform: 'none'
  },
  guide: {
    ...typography.tagline11Tag,
    color: colors.black,
    textAlign: 'center',
    textTransform: 'uppercase'
  }
}));
