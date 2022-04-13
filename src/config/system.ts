import { Platform } from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const EMPTY_PUBLIC_KEY_HASH = 'empty_public_key_hash';
