import { AxiosError } from 'axios';

import { isDefined } from './is-defined';

export const getAxiosQueryErrorMessage = (error: unknown, fallbackErrorMessage = 'Unknown error') => {
  if (error instanceof AxiosError) {
    const responseDescription = isDefined(error.response) ? `with status ${error.response.status}` : 'without response';

    return `Request to ${error.config.url} failed ${responseDescription}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackErrorMessage;
};
