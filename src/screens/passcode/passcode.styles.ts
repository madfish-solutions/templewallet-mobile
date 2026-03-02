import { StyleSheet } from 'react-native';

import { zIndexEnum } from 'src/enums/z-index.enum';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const usePassCodeStyles = createUseStyles(({ typography, colors }) => ({
  root: {
    ...StyleSheet.absoluteFill,
    zIndex: zIndexEnum.PasswordLockScreen
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
