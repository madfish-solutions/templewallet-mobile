import { pickBy } from 'lodash-es';

import { UNIVERSAL_LINKS_DOMAIN_URI_PREFIX } from './env.utils';
import { isDefined } from './is-defined';

export const getTempleUniversalLink = (domain = '/', queryParams?: Partial<StringRecord>) => {
  const url = new URL(domain, UNIVERSAL_LINKS_DOMAIN_URI_PREFIX);
  url.search = new URLSearchParams(pickBy(queryParams ?? {}, isDefined)).toString();

  return url.toString();
};
