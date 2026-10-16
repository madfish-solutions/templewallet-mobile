import AsyncStorage from '@react-native-async-storage/async-storage';
import { firstValueFrom } from 'rxjs';

import { mockKeychain } from 'src/mocks/react-native-keychain.mock';

import {
  getBiometryKeychainOptions,
  getKeychainOptions,
  resetKeychain$,
  SHELTER_VERSION_STORAGE_KEY
} from './keychain.utils';

const mockBiometryKeychainOptions = {
  service: 'com.madfish.temple-wallet/biometry-protected-app-password',
  accessControl: 'BiometryCurrentSet',
  accessible: 'AccessibleWhenPasscodeSetThisDeviceOnly'
};

describe('getKeychainOptions', () => {
  it('should return object if we passing non-empty string', () => {
    expect(getKeychainOptions('test', 0)).toEqual({
      service: 'com.madfish.temple-wallet/test',
      accessible: mockBiometryKeychainOptions.accessible
    });
  });

  it('should return object if we passing empty string', () => {
    expect(getKeychainOptions('', 0)).toEqual({
      service: 'com.madfish.temple-wallet/',
      accessible: mockBiometryKeychainOptions.accessible
    });
  });
});

describe('getBiometryKeychainOptions', () => {
  it('should return keychain options object with hardcoded password storage key', () => {
    expect(getBiometryKeychainOptions(0)).toEqual(mockBiometryKeychainOptions);
  });
});

interface PendingReset {
  promise: Promise<void>;
  resolve: EmptyFn;
}

const createPendingReset = (): PendingReset => {
  let resolve: EmptyFn = jest.fn();
  const promise = new Promise<void>(resolvePromise => {
    resolve = resolvePromise;
  });

  return { promise, resolve };
};

describe('resetKeychain$', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('starts the deletion only after subscription', () => {
    resetKeychain$();

    expect(mockKeychain.getAllGenericPasswordServices).not.toHaveBeenCalled();
    expect(mockKeychain.resetGenericPassword).not.toHaveBeenCalled();
  });

  it('waits for every account and the shelter version before completion', async () => {
    const firstAccount = createPendingReset();
    const secondAccount = createPendingReset();
    const version = createPendingReset();
    const onComplete = jest.fn();
    mockKeychain.getAllGenericPasswordServices.mockResolvedValueOnce(['first-account', 'second-account']);
    mockKeychain.resetGenericPassword
      .mockReturnValueOnce(firstAccount.promise)
      .mockReturnValueOnce(secondAccount.promise);
    jest.spyOn(AsyncStorage, 'removeItem').mockReturnValueOnce(version.promise);

    const resetPromise = firstValueFrom(resetKeychain$()).then(onComplete);
    await Promise.resolve();

    expect(mockKeychain.resetGenericPassword).toHaveBeenCalledWith({ service: 'first-account' });
    expect(mockKeychain.resetGenericPassword).toHaveBeenCalledWith({ service: 'second-account' });
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(SHELTER_VERSION_STORAGE_KEY);
    expect(onComplete).not.toHaveBeenCalled();

    firstAccount.resolve();
    await Promise.resolve();
    expect(onComplete).not.toHaveBeenCalled();

    secondAccount.resolve();
    await Promise.resolve();
    expect(onComplete).not.toHaveBeenCalled();

    version.resolve();
    await resetPromise;
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('reports a native deletion error to the reset flow', async () => {
    const error = new Error('Keychain deletion failed');
    mockKeychain.resetGenericPassword.mockRejectedValueOnce(error);

    await expect(firstValueFrom(resetKeychain$())).rejects.toBe(error);
  });
});
