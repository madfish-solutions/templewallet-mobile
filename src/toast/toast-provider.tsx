import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { EmptyFn } from '../config/general';
import { ToastTypeEnum } from '../enums/toast-type.enum';
import { CopiedToast } from './copied-toast/copied-toast';
import { ToastProviderStyles } from './toast-provider.styles';

const config = {
  [ToastTypeEnum.Copied]: ({ hide }: { hide: EmptyFn }) => <CopiedToast onPress={hide} />
};

export const ToastProvider = () => {
  const { top } = useSafeAreaInsets();

  return <Toast ref={ref => Toast.setRef(ref)} config={config} topOffset={top} style={ToastProviderStyles.toast} />;
};
