import { StyleSheet } from 'react-native';

import { zIndexEnum } from '../../enums/z-index.enum';
import { createUseStyles } from '../../styles/create-use-styles';

export const useEnterPasswordStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: zIndexEnum.PasswordLockScreen
  },
  imageView: {
    alignItems: 'center',
    marginBottom: '20%'
  },
  bottomText: {
    ...typography.caption13Regular,
    color: colors.gray1,
    textAlign: 'center'
  }
}));
