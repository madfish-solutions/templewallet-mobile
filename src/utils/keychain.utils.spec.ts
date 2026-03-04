import { getBiometryKeychainOptions, getKeychainOptions } from './keychain.utils';

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
