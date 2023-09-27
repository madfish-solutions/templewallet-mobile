import { useCallback } from 'react';
import { Linking } from 'react-native';

import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';

import { isDcpNode } from '../network.utils';

export const openUrl = (url: string) => {
  Linking.canOpenURL(url).then(() => Linking.openURL(url));
};

export const useOpenUrlInAppBrowser = () => {
  const { navigate } = useNavigation();

  return useCallback((uri: string) => void navigate(ModalsEnum.InAppBrowser, { uri }), [navigate]);
};

export const tzktUrl = (rpcUrl: string, address: string) =>
  isDcpNode(rpcUrl) ? `https://explorer.tlnt.net/${address}` : `https://tzkt.io/${address}`;
