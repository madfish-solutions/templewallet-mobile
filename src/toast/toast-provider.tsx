import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { zIndexesEnum } from '../config/styles';

export const ToastProvider = () => {
  const { top } = useSafeAreaInsets();

  return <Toast ref={ref => Toast.setRef(ref)} topOffset={top} style={{ zIndex: zIndexesEnum.Toast }} />;
};
