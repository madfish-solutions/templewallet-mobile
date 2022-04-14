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

const DEFAULT_ERROR_MESSAGE = 'Warning! The transaction is likely to fail!';
const TAQUITO_MISSED_BLOCK_ERROR_MESSAGE =
  'Taquito missed a block while waiting for operation confirmation and was not able to find the operation';
const TAQUITO_500_ERROR_MESSAGE = 'Http error response: (500)';
/**
 * there are actually two errors:
 * "JSON Parse error: Unexpected token"
 * "JSON Parse error: Unexpected identifier"
 * in the JSON_PARSE_ERROR
 */
const JSON_PARSE_ERROR = 'JSON Parse error: Unexpected';

export const showErrorToast = ({ description, title, onPress }: ToastProps) => {
  const slicedErrorMessage = description.slice(0, 26);

  if (description === TAQUITO_MISSED_BLOCK_ERROR_MESSAGE) {
    return;
  }

  if (description.startsWith(JSON_PARSE_ERROR)) {
    return Toast.show({
      type: ToastTypeEnum.Error,
      text1: title,
      text2: errorMessageFilter(DEFAULT_ERROR_MESSAGE),
      onPress
    });
  }

  if (TAQUITO_500_ERROR_MESSAGE === slicedErrorMessage) {
    return Toast.show({
      type: ToastTypeEnum.Error,
      text1: title,
      text2: errorMessageFilter(DEFAULT_ERROR_MESSAGE),
      onPress
    });
  }

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
