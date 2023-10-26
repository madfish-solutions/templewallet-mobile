import React, { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast, { ToastConfigParams } from 'react-native-toast-message';

import { EmptyFn } from '../config/general';
import { isIOS } from '../config/system';
import { ToastTypeEnum } from '../enums/toast-type.enum';
import { formatSize } from '../styles/format-size';

import { CopiedToast } from './copied-toast/copied-toast';
import { CustomToast } from './toast/custom-toast';

type CustomToastProps = ToastConfigParams<{
  operationHash: string;
  isCopyButtonVisible: boolean;
}>;

const config = {
  [ToastTypeEnum.Copied]: ({ hide }: { hide: EmptyFn }) => <CopiedToast onPress={hide} />,
  [ToastTypeEnum.Success]: ({ hide, text1, text2, onPress, props }: CustomToastProps) => (
    <CustomToast
      title={text1}
      description={text2}
      toastType={ToastTypeEnum.Success}
      operationHash={props?.operationHash}
      hide={hide}
      onPress={onPress}
    />
  ),
  [ToastTypeEnum.Error]: ({ hide, text1, text2, onPress, props }: CustomToastProps) => (
    <CustomToast
      title={text1}
      description={text2}
      toastType={ToastTypeEnum.Error}
      isCopyButtonVisible={props?.isCopyButtonVisible}
      hide={hide}
      onPress={onPress}
    />
  ),
  [ToastTypeEnum.Warning]: ({ hide, text1, text2, onPress }: CustomToastProps) => (
    <CustomToast title={text1} description={text2} toastType={ToastTypeEnum.Warning} hide={hide} onPress={onPress} />
  )
};

export const ToastProvider = () => {
  const { top } = useSafeAreaInsets();

  const topOffset = useMemo(() => (isIOS ? top : top + formatSize(2)), [top]);

  return <Toast config={config} topOffset={topOffset} />;
};
