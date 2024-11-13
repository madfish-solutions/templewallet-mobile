import { useCallback, useEffect } from 'react';
import { Linking } from 'react-native';

import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useIsAuthorisedSelector } from 'src/store/wallet/wallet-selectors';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { isString } from 'src/utils/is-string';
import { isCollectibleUniversalLink, parseCollectibleUniversalLinkSlug } from 'src/utils/nft-universal-links';

export const useNFTUniversalLinks = () => {
  const isAuthorised = useIsAuthorisedSelector();
  const { navigate } = useNavigation();

  const handleUniversalLinks = useCallback(
    (link: string | null) => {
      if (!isString(link) || !isCollectibleUniversalLink(link)) {
        return;
      }

      if (!isAuthorised) {
        return void showErrorToast({ description: 'You need to create an account to view the NFT' });
      }

      const slug = parseCollectibleUniversalLinkSlug(link);

      if (isString(slug)) {
        navigate(ModalsEnum.CollectibleModal, { slug });
      } else {
        showErrorToast({ description: 'Cannot parse NFT link' });
      }
    },
    [isAuthorised, navigate]
  );

  useEffect(() => {
    if (!isAuthorised) {
      return;
    }

    Linking.getInitialURL().then(handleUniversalLinks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isAuthorised) {
      return;
    }

    const subscription = Linking.addEventListener('url', ({ url }) => handleUniversalLinks(url));

    return () => subscription.remove();
  }, [handleUniversalLinks, isAuthorised]);

  return null;
};
