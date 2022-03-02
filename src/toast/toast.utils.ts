import Toast from 'react-native-toast-message';

import { EmptyFn } from '../config/general';
import { ToastTypeEnum } from '../enums/toast-type.enum';
import { errorMessageFilter } from '../utils/error-message.util';

interface ToastProps {
  description: string;
  title?: string;
  onPress?: EmptyFn;
  operationHash?: string;
}

const TAQUITO_MISSED_BLOCK_ERROR_MESSAGE =
  'Taquito missed a block while waiting for operation confirmation and was not able to find the operation';

export const showErrorToast = ({ description, title, onPress }: ToastProps) => {
  if (description === TAQUITO_MISSED_BLOCK_ERROR_MESSAGE) return;

  return Toast.show({
    type: ToastTypeEnum.Error,
    text1: title,
    text2: errorMessageFilter(description),
    onPress
  });
};

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
