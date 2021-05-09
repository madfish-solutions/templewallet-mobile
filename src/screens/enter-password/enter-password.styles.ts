import { StyleSheet } from 'react-native';

import { zIndexEnum } from '../../enums/z-index.enum';
import { createUseStyles } from '../../styles/create-use-styles';

export const useEnterPasswordStyles = createUseStyles(({ colors }) => ({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: zIndexEnum.PasswordLockScreen,
    backgroundColor: colors.white
  }
}));
