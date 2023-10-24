import { utils } from '@react-native-firebase/app';
import dynamicLinks, { FirebaseDynamicLinksTypes } from '@react-native-firebase/dynamic-links';
import { useEffect } from 'react';

import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useIsAuthorisedSelector } from 'src/store/wallet/wallet-selectors';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { parseCollectibleDynamicLinkSlug } from 'src/utils/nft-dynamic-links';

export const useNFTDynamicLinks = () => {
  const isAuthorised = useIsAuthorisedSelector();
  const { navigate } = useNavigation();

  const handleDynamicLinks = (link: FirebaseDynamicLinksTypes.DynamicLink | null) => {
    if (!link) {
      return;
    }

    if (!isAuthorised) {
      return void showErrorToast({ description: 'You need to create an account to view the NFT' });
    }

    const slug = parseCollectibleDynamicLinkSlug(link.url);

    if (slug) {
      navigate(ModalsEnum.CollectibleModal, { slug });
    } else {
      showErrorToast({ description: 'Cannot parse NFT link' });
    }
  };

  const handleAppLaunchLink = async () => {
    const { isAvailable } = utils().playServicesAvailability;

    if (isAvailable) {
      const initialLink = await dynamicLinks().getInitialLink();
      handleDynamicLinks(initialLink);
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
