import { Linking } from 'react-native';

import { isDcpNode } from './network.utils';

export const openUrl = (url: string) => Linking.canOpenURL(url).then(() => Linking.openURL(url));

export const tzktUrl = (selectedRpcUrl: string, address: string) =>
  isDcpNode(selectedRpcUrl) ? `https://explorer.tlnt.net/${address}` : `https://tzkt.io/${address}`;
