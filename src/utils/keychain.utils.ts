import Keychain from 'react-native-keychain';

import { isAndroid } from '../config/system';

export const APP_IDENTIFIER = 'com.madfish.temple-wallet';

export const PASSWORD_CHECK_KEY = 'app-password';
export const PASSWORD_STORAGE_KEY = 'biometry-protected-app-password';

export const getKeychainOptions = (key: string): Keychain.Options => ({
  service: `${APP_IDENTIFIER}/${key}`,
  securityLevel: isAndroid ? Keychain.SECURITY_LEVEL.SECURE_HARDWARE : undefined,
  storage: isAndroid ? Keychain.STORAGE_TYPE.RSA : undefined
});

export const biometryKeychainOptions: Keychain.Options = {
  ...getKeychainOptions(PASSWORD_STORAGE_KEY),
  accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
  authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS
};
