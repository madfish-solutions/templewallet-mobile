import { StyleSheet } from 'react-native';

import { zIndexEnum } from '../enums/z-index.enum';
import { formatSize } from '../styles/format-size';

export const ToastProviderStyles = StyleSheet.create({
  toast: {
    zIndex: zIndexEnum.Toast,
    left: formatSize(48),
    right: formatSize(48)
  }
});
