import { useCallback } from 'react';
import { Linking } from 'react-native';

import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';

import { isDcpNode } from '../network.utils';

interface OpenUrlOptions {
  rethrowError?: boolean;
}

export const openUrl = (url: string, { rethrowError = false }: OpenUrlOptions = {}) =>
  Linking.canOpenURL(url)
    .then(canOpen => {
      if (!canOpen) {
        throw new Error(`Cannot open URL: ${url}`);
      }

      return Linking.openURL(url);
    })
    .catch(error => {
      if (rethrowError) {
        throw error;
      }

      console.error(error);
    });

export const useOpenUrlInAppBrowser = () => {
  const navigateToModal = useNavigateToModal();

  return useCallback((uri: string) => void navigateToModal(ModalsEnum.InAppBrowser, { uri }), [navigateToModal]);
};

export const tzktUrl = (rpcUrl: string, address: string) =>
  isDcpNode(rpcUrl) ? `https://explorer.tlnt.net/${address}` : `https://tzkt.io/${address}`;
