import { HttpResponseError } from '@taquito/http-utils';

export const getTaquitoRpcErrorMessage = (error: unknown, fallbackErrorMessage = 'Unknown error') => {
  if (error instanceof HttpResponseError) {
    return `Request to ${error.url} failed with status ${error.status}: ${error.body}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackErrorMessage;
};
