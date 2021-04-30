import { StyleSheet } from 'react-native';

import { white } from '../../config/styles';
import { zIndexEnum } from '../../enums/z-index.enum';

export const EnterPasswordStyles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: zIndexEnum.PasswordLockScreen,
    backgroundColor: white
  }
});
