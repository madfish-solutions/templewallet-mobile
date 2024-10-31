import { transform } from 'lodash-es';

import { UNIVERSAL_LINKS_DOMAIN_URI_PREFIX } from './env.utils';
import { isTruthy } from './is-truthy';
import { getTempleUniversalLink } from './universal-links';
import { buildSafeURL } from './url.utils';

export const buildCollectibleUniversalLink = (slug: string, image?: string, title?: string, description?: string) =>
  getTempleUniversalLink(
    '/nft',
    transform<string | undefined, StringRecord>(
      { slug, image, title, description },
      (acc, value, key) => {
        if (isTruthy(value) && key === 'description') {
          acc[key] = value.length > 500 ? `${value.slice(0, 500)}...` : value;
        } else if (isTruthy(value)) {
          acc[key] = value;
        }

        return acc;
      },
      {}
    )
  );

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
