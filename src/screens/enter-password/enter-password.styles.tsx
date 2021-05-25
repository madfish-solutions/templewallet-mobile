import { StyleSheet } from 'react-native';

import { zIndexEnum } from '../../enums/z-index.enum';
import { createUseStyles } from '../../styles/create-use-styles';

export const useEnterPasswordStyles = createUseStyles(() => ({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: zIndexEnum.PasswordLockScreen
  },
  bottomView: {
    alignItems: 'center'
  },
  imageView: {
    marginTop: 'auto',
    alignItems: 'center',
    marginBottom: '30%'
  },
  formikView: {
    marginTop: 'auto'
  }
}));
