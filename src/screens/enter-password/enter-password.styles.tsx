import { StyleSheet } from 'react-native';

import { zIndexEnum } from '../../enums/z-index.enum';
import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useEnterPasswordStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: zIndexEnum.PasswordLockScreen
  },
  imageView: {
    marginTop: formatSize(108),
    alignItems: 'center'
  },
  bottomText: {
    ...typography.caption13Regular,
    color: colors.gray1,
    textAlign: 'center'
  },
  passwordBlocked: {
    height: formatSize(40),
    marginLeft: formatSize(4)
  },
  passwordInputSection: {
    flexDirection: 'row'
  },
  passwordInputWrapper: {
    flexGrow: 1
  }
}));
