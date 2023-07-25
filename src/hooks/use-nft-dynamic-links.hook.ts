import { utils } from '@react-native-firebase/app';
import dynamicLinks, { FirebaseDynamicLinksTypes } from '@react-native-firebase/dynamic-links';
import { useEffect } from 'react';

import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useIsAuthorisedSelector } from 'src/store/wallet/wallet-selectors';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { isDefined } from 'src/utils/is-defined';

const NOT_AUTHORISED_ERROR_MESSAGE = 'You need to create an account to view the NFT';

const decodeNFTJsonData = (url: string) => {
  const encodedData = url.split('=').pop();

  if (isDefined(encodedData)) {
    try {
      const decodedData = decodeURIComponent(encodedData.replace(/\+/g, ' '));
      const data: { slug: string } = JSON.parse(decodedData);

      return data;
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
        const data = decodeNFTJsonData(link.url);

        if (isDefined(data)) {
          navigate(ModalsEnum.CollectibleModal, { slug: data.slug });
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
