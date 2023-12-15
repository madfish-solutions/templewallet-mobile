import { Platform } from 'react-native';
import { getManufacturerSync } from 'react-native-device-info';

export const isIOS = Platform.OS === 'ios';

export const isAndroid = Platform.OS === 'android';

/** @deprecated // BAD PRACTICE */

export const EMPTY_PUBLIC_KEY_HASH = 'EMPTY_PUBLIC_KEY_HASH';
export const manufacturer = getManufacturerSync();
