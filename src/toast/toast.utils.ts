import Toast from 'react-native-toast-message';

import { EmptyFn } from '../config/general';
import { ToastTypeEnum } from '../enums/toast-type.enum';

interface ToastProps {
  description: string;
  title?: string;
  onPress?: EmptyFn;
  operationHash?: string;
}

export const showErrorToast = ({ description, title, onPress }: ToastProps) =>
  Toast.show({
    type: ToastTypeEnum.Error,
    text1: title,
    text2: description,
    onPress
  });

export const showSuccessToast = ({ description, title, onPress, operationHash }: ToastProps) =>
  Toast.show({
    type: ToastTypeEnum.Success,
    text1: title,
    text2: description,
    onPress,
    props: {
      operationHash
    }
  });

export const showWarningToast = ({ description, title, onPress }: ToastProps) =>
  Toast.show({
    type: ToastTypeEnum.Warning,
    text1: title,
    text2: description,
    onPress
  });

export const showCopiedToast = () => Toast.show({ type: ToastTypeEnum.Copied });
