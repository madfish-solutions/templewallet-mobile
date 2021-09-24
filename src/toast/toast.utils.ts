import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';

import { EmptyFn } from '../config/general';
import { ToastTypeEnum } from '../enums/toast-type.enum';

interface ToastProps {
  description: string;
  title?: string;
  onPress?: EmptyFn;
  operationHash?: string;
}

const position = Platform.OS === 'ios' ? 'top' : 'bottom';

export const showErrorToast = ({ description, title, onPress }: ToastProps) =>
  Toast.show({
    type: ToastTypeEnum.Error,
    position,
    text1: title,
    text2: description,
    onPress
  });

export const showSuccessToast = ({ description, title, onPress, operationHash }: ToastProps) =>
  Toast.show({
    type: ToastTypeEnum.Success,
    position,
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
    position,
    text1: title,
    text2: description,
    onPress
  });

export const showCopiedToast = () => Toast.show({ type: ToastTypeEnum.Copied, position });
