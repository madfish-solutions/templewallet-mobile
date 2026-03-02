import { StyleSheet } from 'react-native';

import { zIndexEnum } from 'src/enums/z-index.enum';
import { createUseStyles } from 'src/styles/create-use-styles';

export const useSplashModalStyles = createUseStyles(({ colors }) => ({
  rootContainer: {
    ...StyleSheet.absoluteFill,
    zIndex: zIndexEnum.PasswordLockScreen,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pageBG
  },
  container: { justifyContent: 'center', flex: 1 }
}));
