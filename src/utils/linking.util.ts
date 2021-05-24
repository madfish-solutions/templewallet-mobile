import { Linking } from 'react-native';

export const openUrl = (url: string) => Linking.canOpenURL(url).then(() => Linking.openURL(url));
