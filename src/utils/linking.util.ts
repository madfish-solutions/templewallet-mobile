import { Linking } from 'react-native';

import { isDcpNode } from './network.utils';

export const openUrl = (url: string) => Linking.canOpenURL(url).then(() => Linking.openURL(url));

export const tzktUrl = (address: string, selectedRpcUrl: string) =>
  isDcpNode(selectedRpcUrl) ? `https://explorer.tlnt.net/${address}` : `https://tzkt.io/${address}`;
