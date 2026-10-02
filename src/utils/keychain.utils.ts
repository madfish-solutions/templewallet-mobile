import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SetOptions,
  ACCESSIBLE,
  SECURITY_LEVEL,
  ACCESS_CONTROL,
  getAllGenericPasswordServices,
  resetGenericPassword
} from 'react-native-keychain';
import { defer, Observable } from 'rxjs';

import { isAndroid, isIOS, manufacturer } from '../config/system';

const APP_IDENTIFIER = 'com.madfish.temple-wallet';

export const PASSWORD_CHECK_KEY = 'app-password';
export const PASSWORD_STORAGE_KEY = 'biometry-protected-app-password';
export const SHELTER_VERSION_STORAGE_KEY = 'shelterVersion';

const manufacturersForMigrationFromChip = ['google', 'samsung'];
export const shouldMoveToSoftwareInV1 = manufacturersForMigrationFromChip.includes(manufacturer.toLowerCase());

export const getKeychainOptions = (key: string, version: number): SetOptions => ({
  service: `${APP_IDENTIFIER}/${key}`,
  accessible: ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
  securityLevel: isAndroid
    ? version === 1 && shouldMoveToSoftwareInV1
      ? SECURITY_LEVEL.SECURE_SOFTWARE
      : SECURITY_LEVEL.SECURE_HARDWARE
    : undefined
});

export const getBiometryKeychainOptions = (version: number): SetOptions => ({
  ...getKeychainOptions(PASSWORD_STORAGE_KEY, version),
  accessControl: ACCESS_CONTROL.BIOMETRY_CURRENT_SET
});

export const getGenericPasswordOptions = (passwordService: string, shelterVersion: number) => {
  const key = passwordService.replace(`${APP_IDENTIFIER}/`, '');
  const isBiometryService = key === PASSWORD_STORAGE_KEY;
  const options = isBiometryService
    ? getBiometryKeychainOptions(shelterVersion)
    : getKeychainOptions(key, shelterVersion);

  return options;
};

export const resetKeychain$ = (): Observable<void> =>
  defer(async () => {
    const services = await getAllGenericPasswordServices(isIOS ? { skipUIAuth: true } : undefined);
    const servicesToReset = isIOS ? [...new Set([...services, `${APP_IDENTIFIER}/${PASSWORD_STORAGE_KEY}`])] : services;

    if (servicesToReset.length > 0) {
      await Promise.all([
        AsyncStorage.removeItem(SHELTER_VERSION_STORAGE_KEY),
        ...servicesToReset.map(service => resetGenericPassword({ service }))
      ]);
    }
  });
