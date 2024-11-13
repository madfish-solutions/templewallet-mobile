import { UNIVERSAL_LINKS_DOMAIN_URI_PREFIX } from './env.utils';
import { isString } from './is-string';
import { isTruthy } from './is-truthy';
import { getTempleUniversalLink } from './universal-links';
import { buildSafeURL } from './url.utils';

export const buildCollectibleUniversalLink = (slug: string, image?: string, title?: string, description?: string) =>
  getTempleUniversalLink('/nft', {
    slug,
    image,
    title,
    description: isString(description) && description.length > 500 ? `${description.slice(0, 500)}...` : description
  });

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
