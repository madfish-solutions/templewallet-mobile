import dynamicLinks from '@react-native-firebase/dynamic-links';

import { TokenInterface } from 'src/token/interfaces/token.interface';
import { formatImgUri } from 'src/utils/image.utils';

const domainUriPrefix = 'https://madfish.page.link';

export const getNftDynamicUrl = async (collectible: TokenInterface) =>
  await dynamicLinks().buildShortLink(
    {
      link: `${domainUriPrefix}/nft?jsonData=${JSON.stringify(collectible)}`,
      domainUriPrefix,
      android: {
        packageName: 'com.templewallet'
      },
      social: {
        title: collectible.name,
        descriptionText: 'Check this NFT with Temple',
        imageUrl: formatImgUri(collectible.thumbnailUri)
      }
    },
    dynamicLinks.ShortLinkType.SHORT
  );
