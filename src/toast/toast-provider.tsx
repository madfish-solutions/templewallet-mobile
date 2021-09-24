import React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { EmptyFn } from '../config/general';
import { ToastTypeEnum } from '../enums/toast-type.enum';
import { formatSize } from '../styles/format-size';
import { CopiedToast } from './copied-toast/copied-toast';
import { ToastProviderStyles } from './toast-provider.styles';
import { CustomToast } from './toast/custom-toast';

interface ToastProps {
  hide: EmptyFn;
  text1: string;
  text2: string;
  onPress?: EmptyFn;
  toastType: ToastTypeEnum;
  props?: {
    operationHash: string;
  };
}

const config = {
  [ToastTypeEnum.Copied]: ({ hide }: { hide: EmptyFn }) => <CopiedToast onPress={hide} />,
  [ToastTypeEnum.Success]: ({ hide, text1, text2, onPress, props }: ToastProps) => (
    <CustomToast
      title={text1}
      description={text2}
      toastType={ToastTypeEnum.Success}
      operationHash={props?.operationHash}
      hide={hide}
      onPress={onPress}
    />
  ),
  [ToastTypeEnum.Error]: ({ hide, text1, text2, onPress }: ToastProps) => (
    <CustomToast title={text1} description={text2} hide={hide} toastType={ToastTypeEnum.Error} onPress={onPress} />
  ),
  [ToastTypeEnum.Warning]: ({ hide, text1, text2, onPress }: ToastProps) => (
    <CustomToast title={text1} description={text2} hide={hide} toastType={ToastTypeEnum.Warning} onPress={onPress} />
  )
};

export const ToastProvider = () => {
  const { top } = useSafeAreaInsets();
  const topOffset = Platform.OS === 'ios' ? top : top + formatSize(2);

  return (
    <Toast ref={ref => Toast.setRef(ref)} config={config} topOffset={topOffset} style={ToastProviderStyles.toast} />
  );
};
