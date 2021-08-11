import { NativeModules } from 'react-native';

export const mockRandomKey = 'randomKey';
export const mockCorrectPassword = 'testPassword';
export const mockCorrectPbkdf2Key = 'pbkdf2Key';
const mockIncorrectPbkdf2Key = 'incorrectPbkdf2Key';

export const mockEncryptedString = 'encryptedString';
export const mockUnencryptedString = 'testString';

export const mockNativeAes = {
  pbkdf2: jest.fn(password =>
    Promise.resolve(password === mockCorrectPassword ? mockCorrectPbkdf2Key : mockIncorrectPbkdf2Key)
  ),
  encrypt: jest.fn(() => Promise.resolve(mockEncryptedString)),
  decrypt: jest.fn((_, key) =>
    key === mockCorrectPbkdf2Key ? Promise.resolve(mockUnencryptedString) : Promise.reject()
  ),
  randomKey: jest.fn(() => Promise.resolve(mockRandomKey))
};

NativeModules.RNPermissions = {};
NativeModules.Aes = mockNativeAes;
