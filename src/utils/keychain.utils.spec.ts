import { biometryKeychainOptions, getKeychainOptions } from './keychain.utils';

const mockBiometryKeychainOptions = {
  service: 'com.madfish-solutions.temple-mobile/biometry-protected-app-password',
  accessControl: 'BiometryCurrentSet',
  authenticationType: 'AuthenticationWithBiometrics'
};

describe('getKeychainOptions', () => {
  it('should return object if we passing non-empty string', () => {
    expect(getKeychainOptions('test')).toEqual({ service: 'com.madfish-solutions.temple-mobile/test' });
  });

  it('should return object if we passing empty string', () => {
    expect(getKeychainOptions('')).toEqual({ service: 'com.madfish-solutions.temple-mobile/' });
  });
});

describe('biometryKeychainOptions', () => {
  it('should return keychain options object with hardcoded password storage key', () => {
    expect(biometryKeychainOptions).toEqual(mockBiometryKeychainOptions);
  });
});
