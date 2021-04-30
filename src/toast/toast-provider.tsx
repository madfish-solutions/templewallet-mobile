import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { zIndexEnum } from '../enums/z-index.enum';

export const ToastProvider = () => {
  const { top } = useSafeAreaInsets();

  return <Toast ref={ref => Toast.setRef(ref)} topOffset={top} style={{ zIndex: zIndexEnum.Toast }} />;
};
