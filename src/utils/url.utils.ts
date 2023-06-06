/*
  (!) Native `URL` does not work with `localhost` for `baseUrl` in build.
  And `react-native-url-polyfill` does not work with those during unit tests.
*/

import { URL } from 'react-native-url-polyfill';

export const concatUrlPath = (baseUrl: string, path: string) => {
  // const result = new URL(path, baseUrl).href;
  // console.log('a', result);

  // return new URL(path, baseUrl).href;

  // baseUrl = new URL(baseUrl).href; // gonna end with '/'
  baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(baseUrl.length - 1) : baseUrl;
  path = path.startsWith('/') ? path.slice(1) : path;

  console.log('b', baseUrl, path);

  return `${baseUrl}/${path}`;
};

export const getUrlQueryParams = (url: string) => new URL(url).searchParams;
