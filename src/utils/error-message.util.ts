const JSON_VALIDATION_ERROR_MESSAGE = 'Unexpected token u in JSON at position 0';
const FILTERED_ERROR_MESSAGE = 'Warning! The transaction is likely to fail!';

export const errorMessageFilter = (message: string) => {
  if (message === JSON_VALIDATION_ERROR_MESSAGE) {
    return FILTERED_ERROR_MESSAGE;
  }

  return message;
};
