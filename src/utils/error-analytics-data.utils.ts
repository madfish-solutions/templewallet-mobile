import { ServerError, ServerParseError } from '@apollo/client';
import { HttpResponseError } from '@taquito/http-utils';
import { TezosOperationError } from '@taquito/taquito';
import { AxiosError } from 'axios';
import { pick } from 'lodash-es';
import { Observable, withLatestFrom } from 'rxjs';

import { RootState } from 'src/store/types';

export const hideAddresses = (data: unknown, addressesToHide: string[]): unknown => {
  if (Array.isArray(data)) {
    return data.map(item => hideAddresses(item, addressesToHide));
  }

  if (typeof data === 'object' && data !== null) {
    return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, hideAddresses(value, addressesToHide)]));
  }

  if (typeof data === 'string') {
    return addressesToHide.reduce(
      (acc, address) =>
        acc.replace(
          new RegExp(address, 'g'),
          address.startsWith('tz') ? address.slice(0, 3) + '[REDACTED]' : '[REDACTED]'
        ),
      data
    );
  }

  return data;
};

const isApolloServerError = (error: Error): error is ServerError => error.name === 'ServerError';
const isApolloServerParseError = (error: Error): error is ServerParseError => error.name === 'ServerParseError';

export const getErrorDerivedEventProps = (error: unknown, addressesToHide: string[]) => {
  let propsBeforeAnonymization: StringRecord<unknown> = {};

  if (error instanceof AxiosError) {
    propsBeforeAnonymization = {
      axiosResponse: pick(error.response ?? {}, ['status', 'data']),
      axiosConfig: pick(error.config ?? {}, ['url', 'method', 'baseURL', 'data', 'params', 'headers'])
    };
  } else if (error instanceof HttpResponseError) {
    propsBeforeAnonymization = {
      taquitoHttpResponseError: pick(error, ['status', 'body', 'url'])
    };
  } else if (error instanceof TezosOperationError) {
    propsBeforeAnonymization = {
      tezosOperationError: pick(error, ['errors', 'errorDetails', 'operationsWithResults'])
    };
  } else if (error instanceof Error) {
    propsBeforeAnonymization = {
      message: error.message
    };

    if (isApolloServerError(error)) {
      propsBeforeAnonymization.apolloError = pick(error, ['name', 'result', 'statusCode']);
    } else if (isApolloServerParseError(error)) {
      propsBeforeAnonymization.apolloError = pick(error, ['name', 'bodyText', 'statusCode']);
    }
  }

  if (error instanceof Error) {
    propsBeforeAnonymization.stack = error.stack;
  }

  return hideAddresses(propsBeforeAnonymization, addressesToHide) as StringRecord<unknown>;
};

export interface UserAnalyticsCredentials {
  userId?: string;
  ABTestingCategory?: string;
  isAnalyticsEnabled: boolean;
}

export const withUserAnalyticsCredentials =
  <T>(state$: Observable<RootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (value, state): [T, UserAnalyticsCredentials] => {
        const { settings, abTesting } = state;
        const { userId, isAnalyticsEnabled } = settings;

        return [value, { userId, ABTestingCategory: abTesting.groupName, isAnalyticsEnabled }];
      })
    );

export class AnalyticsError extends Error {
  constructor(
    public readonly error: unknown,
    public readonly addressesToHide: string[],
    public readonly additionalProperties: Record<string, unknown>,
    message?: string
  ) {
    super(message ?? (error instanceof Error ? error.message : 'Unknown error'));
  }
}
