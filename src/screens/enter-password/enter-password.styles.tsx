import { StyleSheet } from 'react-native';

import { zIndexEnum } from 'src/enums/z-index.enum';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useEnterPasswordStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    ...StyleSheet.absoluteFill,
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
  passwordInputSection: {
    flexDirection: 'row'
  },
  passwordBiometry: {
    flexDirection: 'row',
    flexShrink: 0
  },
  passwordInputWrapper: {
    flexGrow: 1,
    flexShrink: 1
  }
}));
