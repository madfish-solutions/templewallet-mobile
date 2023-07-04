import { utils } from '@react-native-firebase/app';
import dynamicLinks, { FirebaseDynamicLinksTypes } from '@react-native-firebase/dynamic-links';
import { useEffect } from 'react';

import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useIsAuthorisedSelector } from 'src/store/wallet/wallet-selectors';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { isDefined } from 'src/utils/is-defined';

import { CollectibleInterface } from '../token/interfaces/collectible-interfaces.interface';

const NOT_AUTHORISED_ERROR_MESSAGE = 'You need to create an account to view the NFT';

const decodeNFTJsonData = (url: string) => {
  const encodedData = url.split('=').pop();

  if (isDefined(encodedData)) {
    try {
      const decodedData = decodeURIComponent(encodedData.replace(/\+/g, ' '));
      const collectible: CollectibleInterface = JSON.parse(decodedData);

      return collectible;
    } catch (e) {
      console.log(e);
    }
  }
};

export const useNFTDynamicLinks = () => {
  const isAuthorised = useIsAuthorisedSelector();
  const { navigate } = useNavigation();

  const handleDynamicLinks = (link: FirebaseDynamicLinksTypes.DynamicLink | null) => {
    if (link && link.url.indexOf('/nft') !== -1) {
      if (isAuthorised) {
        const collectible = decodeNFTJsonData(link.url);

        if (collectible) {
          navigate(ModalsEnum.CollectibleModal, { collectible });
        }
      } else {
        showErrorToast({ description: NOT_AUTHORISED_ERROR_MESSAGE });
      }
    }
  };

  const handleAppLaunchLink = async () => {
    const { isAvailable } = utils().playServicesAvailability;

    if (isAvailable) {
      const initialLink = await dynamicLinks().getInitialLink();
      await handleDynamicLinks(initialLink);
    }
  };

  useEffect(() => {
    handleAppLaunchLink();
  }, []);

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLinks);

    return () => unsubscribe();
  }, [isAuthorised]);

  return null;
};
