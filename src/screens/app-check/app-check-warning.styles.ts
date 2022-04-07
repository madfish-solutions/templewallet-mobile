import { StyleSheet } from 'react-native';

import { zIndexEnum } from '../../enums/z-index.enum';
import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useAppCheckWarningStyles = createUseStyles(({ typography, colors }) => ({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: zIndexEnum.PasswordLockScreen
  },
  container: {
    marginTop: formatSize(108),
    alignSelf: 'center'
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
  }
}));
