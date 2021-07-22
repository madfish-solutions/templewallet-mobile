import { Platform } from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const platformVersion = Number(Platform.Version);
export const ANDROID_10_VERSION = 29;
