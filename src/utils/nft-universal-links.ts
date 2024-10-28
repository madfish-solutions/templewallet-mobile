import { UNIVERSAL_LINKS_DOMAIN_URI_PREFIX } from './env.utils';
import { isTruthy } from './is-truthy';
import { getTempleUniversalLink } from './universal-links';
import { buildSafeURL } from './url.utils';

export const buildCollectibleUniversalLink = (slug: string) => getTempleUniversalLink('/nft', { slug });

export const isCollectibleUniversalLink = (urlStr: string) => {
  const pathname = buildSafeURL(urlStr)?.pathname;

  return (
    urlStr.startsWith(UNIVERSAL_LINKS_DOMAIN_URI_PREFIX) &&
    isTruthy(pathname) &&
    (pathname.endsWith('/nft') || pathname.endsWith('/nft/'))
  );
};

/**
 * @arg urlStr // Collectible universal link. Check with `isCollectibleUniversalLink` before parsing
 */
export const parseCollectibleUniversalLinkSlug = (urlStr: string) => buildSafeURL(urlStr)?.searchParams.get('slug');
