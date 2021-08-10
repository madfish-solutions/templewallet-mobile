import { getKeychainOptions } from './keychain.utils';

describe('getKeychainOptions', () => {
  it('should return object if we passing non-empty string', () => {
    expect(getKeychainOptions('test')).toEqual({ service: 'com.madfish-solutions.temple-mobile/test' });
  });

  it('should return object if we passing empty string', () => {
    expect(getKeychainOptions('')).toEqual({ service: 'com.madfish-solutions.temple-mobile/' });
  });
});
