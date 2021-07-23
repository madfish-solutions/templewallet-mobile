import { GestureResponderEvent } from 'react-native';
import Toast from 'react-native-toast-message';

import { ToastTypeEnum } from '../enums/toast-type.enum';

interface ToastProps {
  text: string;
  title?: string;
  onPress?: () => void;
  operationHash?: string;
}

export const showErrorToast = ({ text = '', title, onPress }: ToastProps) =>
  Toast.show({
    type: ToastTypeEnum.Error,
    text1: title,
    text2: text,
    onPress
  });

export const showSuccessToast = ({ text = '', title, onPress, operationHash }: ToastProps) =>
  Toast.show({
    type: ToastTypeEnum.Success,
    text1: title,
    text2: text,
    onPress,
    props: {
      operationHash
    }
  });

export const showWarningToast = ({ text = '', title, onPress }: ToastProps) =>
  Toast.show({
    type: ToastTypeEnum.Warning,
    text1: title,
    text2: text,
    onPress
  });

export const showCopiedToast = () => Toast.show({ type: ToastTypeEnum.Copied });
