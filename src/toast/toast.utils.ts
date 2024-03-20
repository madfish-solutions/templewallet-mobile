import { debounce } from 'lodash-es';
import Toast from 'react-native-toast-message';

import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ToastTypeEnum } from 'src/enums/toast-type.enum';

export { ToastError, showErrorToast, showErrorToastByError, catchThrowToastError } from './error-toast.utils';

interface ToastProps {
  description: string;
  iconName?: IconNameEnum;
  title?: string;
  onPress?: EmptyFn;
  operationHash?: string;
  isCopyButtonVisible?: boolean;
}

export const showSuccessToast = ({ description, title, onPress, iconName, operationHash }: ToastProps) =>
  Toast.show({
    type: ToastTypeEnum.Success,
    text1: title,
    text2: description,
    onPress,
    props: {
      operationHash,
      iconName
    }
  });

export const showWarningToast = ({ description, title, iconName, onPress }: ToastProps) =>
  Toast.show({
    type: ToastTypeEnum.Warning,
    text1: title,
    text2: description,
    onPress,
    props: {
      iconName
    }
  });

export const showCopiedToast = () => Toast.show({ type: ToastTypeEnum.Copied });

export const showFailedStakeLoadWarning = debounce(
  () => showWarningToast({ description: 'Failed to update balances. Please, change RPC and try again.' }),
  2000,
  {
    leading: true,
    trailing: false
  }
);
