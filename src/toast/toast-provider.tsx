import React, { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast, { ToastConfigParams } from 'react-native-toast-message';

import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { isIOS } from 'src/config/system';
import { ToastTypeEnum } from 'src/enums/toast-type.enum';
import { formatSize } from 'src/styles/format-size';

import { CopiedToast } from './copied-toast/copied-toast';
import { CustomToast } from './toast/custom-toast';

type CustomToastProps = ToastConfigParams<{
  operationHash: string;
  isCopyButtonVisible: boolean;
  iconName?: IconNameEnum;
}>;

const config = {
  [ToastTypeEnum.Copied]: ({ hide }: { hide: EmptyFn }) => <CopiedToast onPress={hide} />,
  [ToastTypeEnum.Success]: ({ hide, text1, text2, onPress, props }: CustomToastProps) => (
    <CustomToast
      title={text1}
      description={text2}
      iconName={props?.iconName}
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
      iconName={props?.iconName}
      toastType={ToastTypeEnum.Error}
      isCopyButtonVisible={props?.isCopyButtonVisible}
      hide={hide}
      onPress={onPress}
    />
  ),
  [ToastTypeEnum.Warning]: ({ hide, text1, text2, onPress, props }: CustomToastProps) => (
    <CustomToast
      title={text1}
      description={text2}
      iconName={props?.iconName}
      toastType={ToastTypeEnum.Warning}
      hide={hide}
      onPress={onPress}
    />
  )
};

export const ToastProvider = () => {
  const { top } = useSafeAreaInsets();

  const topOffset = useMemo(() => (isIOS ? top : top + formatSize(2)), [top]);

  return <Toast config={config} topOffset={topOffset} />;
};
