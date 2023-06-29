import { HttpBackend, HttpRequestOptions, HttpRequestFailed, HttpResponseError } from '@taquito/http-utils';
import axios from 'axios';

enum ResponseType {
  TEXT = 'text',
  JSON = 'json'
}

const DEFAULT_QUERY_TIMEOUT = 30000;
/**
 * With this patch we avoid relying on [Vespaiach fetch adapter](https://www.npmjs.com/package/@vespaiach/axios-fetch-adapter) for `HttpBackend`.
 *
 * This is necessary because if no specified key in a bigmap is found, RPC server returns 404 response with empty body. Vespaiach adapter throws
 * an error because body is not a valid JSON, which causes throwing an exception by BigMapAbstraction.get function. With standard axios response
 * parsing, the method of BigMapAbstraction just returns 'undefined'
 */
export class NoVespaiachHttpBackend extends HttpBackend {
  async createRequest<T>(
    { url, method, timeout = DEFAULT_QUERY_TIMEOUT, query, headers = {}, json = true }: HttpRequestOptions,
    data?: object | string
  ) {
    let resType: ResponseType;
    let transformResponse = axios.defaults.transformResponse;

    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    if (!json) {
      resType = ResponseType.TEXT;
      transformResponse = [<Type>(v: Type) => v];
    } else {
      resType = ResponseType.JSON;
    }

    try {
      const response = await axios.request<T>({
        url: url + this.serialize(query),
        method: method ?? 'GET',
        headers,
        responseType: resType,
        transformResponse,
        timeout: timeout,
        data
      });

      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        let errorData;

        if (typeof err.response.data === 'object') {
          errorData = JSON.stringify(err.response.data);
        } else {
          errorData = err.response.data;
        }

        throw new HttpResponseError(
          `Http error response: (${err.response.status}) ${errorData}`,
          err.response.status,
          err.response.statusText,
          errorData as string,
          url + this.serialize(query)
        );
      } else {
        throw new HttpRequestFailed(method ?? 'GET', url + this.serialize(query), err as Error);
      }
    }
  }
}
