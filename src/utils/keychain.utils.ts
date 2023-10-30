import Keychain from 'react-native-keychain';
import { of } from 'rxjs';

import { isAndroid, manufacturer } from '../config/system';

const APP_IDENTIFIER = 'com.madfish.temple-wallet';

export const PASSWORD_CHECK_KEY = 'app-password';
export const PASSWORD_STORAGE_KEY = 'biometry-protected-app-password';

const manufacturersForMigrationFromChip = ['google', 'samsung'];
export const shouldUseOnlySoftwareInV1 = manufacturersForMigrationFromChip.includes(manufacturer.toLowerCase());

export const getKeychainOptions = (key: string, version: number): Keychain.Options => ({
  service: `${APP_IDENTIFIER}/${key}`,
  accessible: Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
  securityLevel: isAndroid
    ? /* __DEV__ || */ (version === 1 && shouldUseOnlySoftwareInV1)
      ? Keychain.SECURITY_LEVEL.SECURE_SOFTWARE
      : Keychain.SECURITY_LEVEL.SECURE_HARDWARE
    : undefined
});

export const getBiometryKeychainOptions = (version: number): Keychain.Options => ({
  ...getKeychainOptions(PASSWORD_STORAGE_KEY, version),
  accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
  authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS
});

// pseudo async function as we don't need to wait until Keychain will remove all data
// (common async solution stops reset process)
export const resetKeychain$ = () => {
  Keychain.getAllGenericPasswordServices()
    .then(keychainServicesArray => {
      if (keychainServicesArray.length > 0) {
        Promise.all(keychainServicesArray.map(service => Keychain.resetGenericPassword({ service })));
      }
    })
    .catch(() => void 0);

  return of(0);
};
