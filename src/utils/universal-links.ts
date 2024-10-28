// import { ANDROID_PACKAGE_NAME, APP_STORE_ID, IOS_BUNDLE_ID } from 'src/config/app-info';

import { UNIVERSAL_LINKS_DOMAIN_URI_PREFIX } from './env.utils';

export const getTempleUniversalLink = (domain = '/', queryParams?: StringRecord) => {
  const url = new URL(UNIVERSAL_LINKS_DOMAIN_URI_PREFIX);
  url.pathname = domain;
  url.search = new URLSearchParams(queryParams).toString();

  return url.toString();
};
