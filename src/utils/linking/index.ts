import { useCallback } from 'react';
import { Linking } from 'react-native';

import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';

import { isDcpNode } from '../network.utils';

export const openUrl = (url: string) => {
  Linking.canOpenURL(url)
    .then(() => Linking.openURL(url))
    .catch(e => console.error(e));
};

export const useOpenUrlInAppBrowser = () => {
  const navigateToModal = useNavigateToModal();

  return useCallback((uri: string) => void navigateToModal(ModalsEnum.InAppBrowser, { uri }), [navigateToModal]);
};

export const tzktUrl = (rpcUrl: string, address: string) =>
  isDcpNode(rpcUrl) ? `https://explorer.tlnt.net/${address}` : `https://tzkt.io/${address}`;
