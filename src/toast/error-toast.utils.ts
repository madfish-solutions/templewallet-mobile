import Toast, { ToastShowParams } from 'react-native-toast-message';

import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ToastTypeEnum } from 'src/enums/toast-type.enum';
import { errorMessageFilter } from 'src/utils/error-message.util';
import { isString } from 'src/utils/is-string';

interface ToastProps {
  description: string;
  title?: string;
  iconName?: IconNameEnum;
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

export const showErrorToast = ({ description, title, iconName, onPress, isCopyButtonVisible }: ToastProps) => {
  const slicedErrorMessage = description.slice(0, 26);

  if (description === TAQUITO_MISSED_BLOCK_ERROR_MESSAGE) {
    return;
  }

  const commonParams: ToastShowParams = {
    type: ToastTypeEnum.Error,
    text1: title,
    onPress
  };

  if (description.startsWith(JSON_PARSE_ERROR)) {
    return Toast.show({
      ...commonParams,
      text2: errorMessageFilter(DEFAULT_ERROR_MESSAGE),
      props: {
        iconName
      }
    });
  }

  if (TAQUITO_500_ERROR_MESSAGE === slicedErrorMessage) {
    return Toast.show({
      ...commonParams,
      text2: errorMessageFilter(DEFAULT_ERROR_MESSAGE),
      props: {
        iconName
      }
    });
  }

  return Toast.show({
    ...commonParams,
    text2: errorMessageFilter(description),
    props: {
      isCopyButtonVisible,
      iconName
    }
  });
};

export class ToastError extends Error {
  constructor(public title: string, public description?: string, error?: unknown) {
    super(error instanceof Error ? error.message : description);
  }
}

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
      : new ToastError(title, takeDescriptionFromErrorMsg ? (error as Error)?.message : undefined, error);
  };

export const showErrorToastByError = (error: unknown, fallbackTitle?: string, takeDescriptionFromErrorMsg = false) => {
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
};
