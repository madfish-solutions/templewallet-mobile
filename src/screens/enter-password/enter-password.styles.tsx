import { StyleSheet } from 'react-native';

import { zIndexEnum } from '../../enums/z-index.enum';
import { useCreateStyles } from '../../styles/use-create-styles';

export const useEnterPasswordStyles = () =>
  useCreateStyles(({ colors }) => ({
    root: {
      ...StyleSheet.absoluteFillObject,
      zIndex: zIndexEnum.PasswordLockScreen,
      backgroundColor: colors.white
    }
  }));
