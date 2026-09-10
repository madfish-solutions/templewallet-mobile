import { useCallback } from 'react';
import { Linking } from 'react-native';

import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';
import { useIsInAppBrowserEnabledSelector } from 'src/store/settings/settings-selectors';

export const openUrl = (url: string) => {
  Linking.canOpenURL(url)
    .then(() => Linking.openURL(url))
    .catch(e => console.error(e));
};

export const useOpenUrlInAppBrowser = () => {
  const navigateToModal = useNavigateToModal();

  return useCallback((uri: string) => void navigateToModal(ModalsEnum.InAppBrowser, { uri }), [navigateToModal]);
};

export const useOpenUrl = () => {
  const isInAppBrowserEnabled = useIsInAppBrowserEnabledSelector();
  const openUrlInAppBrowser = useOpenUrlInAppBrowser();

  return useCallback(
    (url: string) => (isInAppBrowserEnabled ? openUrlInAppBrowser(url) : openUrl(url)),
    [isInAppBrowserEnabled, openUrlInAppBrowser]
  );
};

export const tzktUrl = (addressOrTxHash: string) => `https://tzkt.io/${addressOrTxHash}`;
