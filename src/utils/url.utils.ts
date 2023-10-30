/*
  (!) Native `URL` does not work with `localhost` for `baseUrl` in build.
  And `react-native-url-polyfill` does not work with those during unit tests.
*/

import { URL } from 'react-native-url-polyfill';

export function buildSafeURL(input: string): URL | null;
export function buildSafeURL(input: string, base: string | URL): URL | null;
export function buildSafeURL(input: string, base?: string | URL) {
  try {
    // Throws on invalid URL
    return new URL(input, base);
  } catch (error) {
    console.error(error);

    return null;
  }
}

export const concatUrlPath = (baseUrl: string, path: string) => {
  baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, baseUrl.length - 1) : baseUrl;
  path = path.startsWith('/') ? path.slice(1) : path;

  return `${baseUrl}/${path}`;
};

export const getUrlQueryParams = (url: string) => new URL(url).searchParams;

export const getUrlHostname = (url: string) => buildSafeURL(url)?.hostname;
