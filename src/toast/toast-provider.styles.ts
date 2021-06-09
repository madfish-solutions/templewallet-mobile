import { StyleSheet } from 'react-native';

import { zIndexEnum } from '../enums/z-index.enum';

export const ToastProviderStyles = StyleSheet.create({
  toast: {
    zIndex: zIndexEnum.Toast
  }
});
