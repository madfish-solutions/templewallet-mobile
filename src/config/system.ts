import { Platform } from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const MaxPasswordAttemtps = 3;
export const WRONG_PASSWORD_LOCK_TIME = 60_000;
