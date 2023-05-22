import { utils } from '@react-native-firebase/app';
import dynamicLinks, { FirebaseDynamicLinksTypes } from '@react-native-firebase/dynamic-links';
import { useEffect } from 'react';

import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { isDefined } from 'src/utils/is-defined';

const decodeNFTJsonData = (url: string) => {
  const encodedData = url.split('=').pop();

  if (isDefined(encodedData)) {
    try {
      const decodedData = decodeURIComponent(encodedData.replace(/\+/g, ' '));
      const collectible: TokenInterface = JSON.parse(decodedData);

      return collectible;
    } catch {
      return null;
    }
  }

  return null;
};

export const useNFTDynamicLinks = () => {
  const { navigate } = useNavigation();

  const getAppLaunchLink = async () => {
    const { isAvailable } = utils().playServicesAvailability;

    if (isAvailable) {
      const initialLink = await dynamicLinks().getInitialLink();

      if (initialLink) {
        const collectible = decodeNFTJsonData(initialLink.url);

        if (collectible) {
          navigate(ModalsEnum.CollectibleModal, { collectible });
        }
      }
    }

    return null;
  };

  const handleDynamicLinks = async (link: FirebaseDynamicLinksTypes.DynamicLink) => {
    const collectible = decodeNFTJsonData(link.url);

    if (collectible) {
      navigate(ModalsEnum.CollectibleModal, { collectible });
    }

    return null;
  };

  useEffect(() => {
    (async () => {
      await getAppLaunchLink();
    })();

    const unsubscribe = dynamicLinks().onLink(handleDynamicLinks);

    return () => unsubscribe();
  }, []);

  return null;
};
