import dynamicLinks from '@react-native-firebase/dynamic-links';

import { ANDROID_PACKAGE_NAME, APP_STORE_ID, IOS_BUNDLE_ID } from '../config/app-info';

import { DYNAMIC_LINKS_DOMAIN_URI_PREFIX } from './env.utils';

interface Social {
  title?: string;
  descriptionText?: string;
  imageUrl?: string;
}

export const getTempleDynamicLink = async (domain = '/app', social?: Social) =>
  await dynamicLinks().buildShortLink(
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
