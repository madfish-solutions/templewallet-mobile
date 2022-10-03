import { StyleSheet } from 'react-native';

import { zIndexEnum } from '../../enums/z-index.enum';
import { createUseStyles } from '../../styles/create-use-styles';

export const useSplashModalStyles = createUseStyles(({ colors }) => ({
  rootContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: zIndexEnum.PasswordLockScreen,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pageBG
  },
  container: { justifyContent: 'center', flex: 1 }
}));
