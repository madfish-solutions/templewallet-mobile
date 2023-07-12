/*
  (!) Native `URL` does not work with `localhost` for `baseUrl` in build.
  And `react-native-url-polyfill` does not work with those during unit tests.
*/

import { URL } from 'react-native-url-polyfill';

export const concatUrlPath = (baseUrl: string, path: string) => {
  baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, baseUrl.length - 1) : baseUrl;
  path = path.startsWith('/') ? path.slice(1) : path;

  return `${baseUrl}/${path}`;
};

export const getUrlQueryParams = (url: string) => new URL(url).searchParams;
