import { AxiosError } from 'axios';

import { isDefined } from './is-defined';

export const getAxiosQueryErrorMessage = (error: unknown, fallbackErrorMessage = 'Unknown error') => {
  if (error instanceof AxiosError) {
    const responseDescription = isDefined(error.response) ? `with status ${error.response.status}` : 'without response';
    const baseURL = error.config?.baseURL;
    const url = error.config?.url;
    const fullUrl = isDefined(baseURL) ? `${baseURL}${url}` : url;

    return `Request to ${fullUrl} failed ${responseDescription}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackErrorMessage;
};
