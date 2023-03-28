import Toast from 'react-native-toast-message';
import { of } from 'rxjs';

import { EmptyFn } from 'src/config/general';
import { ToastTypeEnum } from 'src/enums/toast-type.enum';
import { errorMessageFilter } from 'src/utils/error-message.util';
import { isString } from 'src/utils/is-string';

interface ToastProps {
  description: string;
  title?: string;
  onPress?: EmptyFn;
  operationHash?: string;
  isCopyButtonVisible?: boolean;
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

export const showErrorToast = ({ description, title, onPress, isCopyButtonVisible }: ToastProps) => {
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
    onPress,
    props: {
      isCopyButtonVisible
    }
  });
};

export class ToastError extends Error {
  constructor(public title: string, public description?: string) {
    super();
  }
}

export const callWithShowErrorToastOnError = async <R>(callback: () => Promise<R>, cleanup?: () => void) => {
  try {
    return await callback();
  } catch (error) {
    try {
      cleanup?.();
    } catch (e) {
      console.error(e);
    }

    let title: string;
    let description: string | undefined;

    if (error instanceof ToastError) {
      title = error.title;
      description = error.description;
    } else {
      console.error(error);

      title = 'Something went wrong';
    }

    if (isString(description)) {
      showErrorToast({ title, description });
    } else {
      showErrorToast({ description: title });
    }

    throw error;
  }
};

/** For the `catch` blocks & `Promise.prototype.catch()`
 *
 * Example:
 * ```typescript
 *   asyncFn().catch(catchThrowToastError('Title of the error'))
 * ```
 */
export const catchThrowToastError =
  (title: string, takeDescriptionFromErrorMsg = false) =>
  (error: unknown) => {
    throw error instanceof ToastError
      ? error
      : new ToastError(title, takeDescriptionFromErrorMsg ? (error as Error)?.message : undefined);
  };

export const buildErrorToaster$ = (fallbackTitle?: string, takeDescriptionFromErrorMsg = false) => {
  return (error: unknown) => {
    let title: string;
    let description: string | undefined;

    if (error instanceof ToastError) {
      title = error.title;
      description = error.description;
    } else {
      console.error(error);

      title = isString(fallbackTitle) ? fallbackTitle : 'Something went wrong';
      description = takeDescriptionFromErrorMsg ? (error as Error)?.message : undefined;
    }

    if (isString(description)) {
      showErrorToast({ title, description });
    } else {
      showErrorToast({ description: title });
    }

    return of(void 0);
  };
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
