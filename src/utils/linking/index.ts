import memoize from 'memoizee';
import { Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';

import { isDcpNode } from '../network.utils';

export const openUrl = async (url: string, inApp = false) => {
  if (!inApp) {
    await openUrlRegularly(url);
  }

  const isAvailable = await canOpenUrlInApp();

  if (isAvailable === false) {
    await openUrlRegularly(url);
  }

  await InAppBrowser.open(url, {
    // iOS Properties
    dismissButtonStyle: 'cancel',
    preferredBarTintColor: 'gray',
    preferredControlTintColor: 'white',
    // Android Properties
    showTitle: true,
    toolbarColor: '#6200EE',
    secondaryToolbarColor: 'black',
    enableUrlBarHiding: true,
    enableDefaultShare: true,
    forceCloseOnRedirection: true
  });
};

const openUrlRegularly = (url: string) => Linking.canOpenURL(url).then(() => Linking.openURL(url));

export const tzktUrl = (rpcUrl: string, address: string) =>
  isDcpNode(rpcUrl) ? `https://explorer.tlnt.net/${address}` : `https://tzkt.io/${address}`;

const canOpenUrlInApp = memoize(() => (Boolean(InAppBrowser) ? InAppBrowser.isAvailable() : Promise.resolve(false)), {
  promise: true
});
