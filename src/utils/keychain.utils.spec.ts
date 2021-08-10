import { APP_IDENTIFIER, getKeychainOptions } from './keychain.utils';

describe('getKeychainOptions', () => {
  it('should return object if we passing non-empty string', () => {
    expect(getKeychainOptions('test')).toEqual({ service: `${APP_IDENTIFIER}/test` });
  });

  it('should return object if we passing empty string', () => {
    expect(getKeychainOptions('')).toEqual({ service: `${APP_IDENTIFIER}/` });
  });
});
