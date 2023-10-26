import dynamicLinks from '@react-native-firebase/dynamic-links';

import { ANDROID_PACKAGE_NAME, APP_STORE_ID, IOS_BUNDLE_ID } from 'src/config/app-info';

import { DYNAMIC_LINKS_DOMAIN_URI_PREFIX } from './env.utils';

interface Social {
  title?: string;
  descriptionText?: string;
  imageUrl?: string;
}

/**
 * (i) Max length for link is 7168 symbols
 * See: https://stackoverflow.com/questions/76084161/firebase-dynamic-links-apiexception-400-length-of-dynamiclink-14793-is-over-th
 */
export const getTempleDynamicLink = (domain = '/app', social?: Social) =>
  dynamicLinks().buildShortLink(
    {
      link: DYNAMIC_LINKS_DOMAIN_URI_PREFIX + domain,
      domainUriPrefix: DYNAMIC_LINKS_DOMAIN_URI_PREFIX,
      ios: {
        appStoreId: APP_STORE_ID,
        bundleId: IOS_BUNDLE_ID
      },
      android: {
        packageName: ANDROID_PACKAGE_NAME
      },
      social
    },
    dynamicLinks.ShortLinkType.SHORT
  );
