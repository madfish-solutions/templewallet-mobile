import { isTruthy } from './is-truthy';
import { buildSafeURL } from './url.utils';

export const buildCollectibleDynamicLink = (slug: string) => `/nft?slug=${slug}`;

export const isCollectibleDynamicLink = (urlStr: string) => {
  const pathname = buildSafeURL(urlStr)?.pathname;

  return isTruthy(pathname) && (pathname.endsWith('/nft') || pathname.endsWith('/nft/'));
};

/**
 * @arg urlStr // Collectible dynamic link. Check with `isCollectibleDynamicLink` before parsing
 */
export const parseCollectibleDynamicLinkSlug = (urlStr: string) => buildSafeURL(urlStr)?.searchParams.get('slug');
