import { NativeModules } from 'react-native';

export const mockRandomKey = 'randomKey';
export const mockPbkdf2Key = 'pbkdf2Key';
export const mockEncryptedString = 'encryptedString';
export const mockUnencryptedString = 'testString';

export const mockNativeAes = {
  pbkdf2: jest.fn(() => Promise.resolve(mockPbkdf2Key)),
  encrypt: jest.fn(() => Promise.resolve(mockEncryptedString)),
  decrypt: jest.fn(() => Promise.resolve(mockUnencryptedString)),
  randomKey: jest.fn(() => Promise.resolve(mockRandomKey))
};

NativeModules.RNPermissions = {};
NativeModules.Aes = mockNativeAes;
