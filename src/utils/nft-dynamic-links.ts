// export const buildCollectibleLink = (slug: string) => `/nft?slug=${JSON.stringgify(encodeURIComponent(slug))}`;

import { URL } from 'react-native-url-polyfill';

// export const buildCollectibleLink = (slug: string) => `/nft?slug=${encodeURIComponent(JSON.stringify({ slug }))}`;
export const buildCollectibleDynamicLink = (slug: string) => `/nft?slug=${slug}`;

/*
const parseCollectibleLinkSlug = (url: string) => {
  const encodedData = url.split('=').pop();

  if (!encodedData) {
    return null;
  }

  try {
    const decodedData = decodeURIComponent(encodedData.replace(/\+/g, ' '));
    const data = JSON.parse(decodedData);

    if (typeof data === 'string') {
      return data;
    }
    if (typeof data === 'object' && 'slug' in data && typeof data.slug === 'string') {
      return data.slug;
    }
  } catch (err) {
    console.error(err);
  }

  return null;
};
*/

// export const parseCollectibleDynamicLinkSlug = (url: string) => new RegExp('nft/(.*)').exec(new URL(url).pathname)?.[1];
export const parseCollectibleDynamicLinkSlug = (urlStr: string) => {
  try {
    const url = new URL(urlStr);
    const { pathname } = url;
    if (pathname === '/nft' || pathname === '/nft/') {
      return url.searchParams.get('slug');
    }
  } catch (error) {
    console.error(error);
  }
};
