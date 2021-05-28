import { Linking } from 'react-native';

export const openUrl = (url: string) => Linking.canOpenURL(url).then(() => Linking.openURL(url));

export const tzktUrl = (address: string) => `https://tzkt.io/${address}`;
