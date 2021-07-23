import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { EmptyFn } from '../config/general';
import { ToastTypeEnum } from '../enums/toast-type.enum';
import { CopiedToast } from './copied-toast/copied-toast';
import { ToastProviderStyles } from './toast-provider.styles';
import { CustomToast } from './toast/custom-toast';

interface ToastProps {
  hide: EmptyFn;
  text1: string;
  text2: string;
  onPress?: () => void;
  toastType: ToastTypeEnum;
  props?: {
    operationHash: string;
  };
}

const config = {
  [ToastTypeEnum.Copied]: ({ hide }: { hide: EmptyFn }) => <CopiedToast onPress={hide} />,
  [ToastTypeEnum.Success]: ({ hide, text1, text2, onPress, props }: ToastProps) => (
    <CustomToast
      text1={text1}
      text2={text2}
      toastType={ToastTypeEnum.Success}
      props={props}
      hide={hide}
      onPress={onPress}
    />
  ),
  [ToastTypeEnum.Error]: ({ hide, text1, text2, onPress }: ToastProps) => (
    <CustomToast text1={text1} text2={text2} onPress={onPress} hide={hide} toastType={ToastTypeEnum.Error} />
  ),
  [ToastTypeEnum.Warning]: ({ hide, text1, text2, onPress }: ToastProps) => (
    <CustomToast text1={text1} text2={text2} onPress={onPress} hide={hide} toastType={ToastTypeEnum.Warning} />
  )
};

export const ToastProvider = () => {
  const { top } = useSafeAreaInsets();

  return <Toast ref={ref => Toast.setRef(ref)} config={config} topOffset={top} style={ToastProviderStyles.toast} />;
};
