import dynamicLinks from '@react-native-firebase/dynamic-links';

import { TokenInterface } from 'src/token/interfaces/token.interface';
import { DYNAMIC_LINKS_DOMAIN_URI_PREFIX } from 'src/utils/env.utils';
import { formatImgUri } from 'src/utils/image.utils';

export const getNftDynamicUrl = async (collectible: TokenInterface) =>
  await dynamicLinks().buildShortLink(
    {
      link: `${DYNAMIC_LINKS_DOMAIN_URI_PREFIX}/nft?jsonData=${encodeURIComponent(JSON.stringify(collectible))}`,
      domainUriPrefix: DYNAMIC_LINKS_DOMAIN_URI_PREFIX,
      ios: {
        appStoreId: '1610108763',
        bundleId: 'com.madfish.temple-wallet'
      },
      android: {
        packageName: 'com.templewallet'
      },
      social: {
        title: collectible.name,
        descriptionText: 'Check this NFT with Temple',
        imageUrl: formatImgUri(collectible.thumbnailUri, 'medium')
      }
    },
    dynamicLinks.ShortLinkType.SHORT
  );
