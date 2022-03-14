import { NativeModules } from 'react-native';

export const mockRandomKey = 'randomKey';
export const mockPbkdf2Key = 'pbkdf2Key';
export const mockEncryptedString = 'encryptedString';
export const mockUnencryptedString = 'testString';
export const mockSymmetricKey64 = 'BQD4WGMsvr/AICOKuua79o9jorgLmGS3QmLjtR3NrSs=';
export const mockPassphrase = 'correctPassword';

export const mockNativeThemis = {
  getConstants: jest.fn(() => Promise.resolve(undefined)),
  symmetricKey64: jest.fn(() => Promise.resolve(mockSymmetricKey64)),
  secureCellSealWithPassphraseEncrypt64: jest.fn((passphrase: string, plaintext: string, context: string) =>
    Promise.resolve(mockEncryptedString)),
  secureCellSealWithPassphraseDecrypt64: jest.fn((passphrase: string, encrypted64: string, context: string) => {
    return new Promise((resolve, reject) => {
      if (passphrase === mockPassphrase) {
        resolve(mockUnencryptedString)
      } else {
        reject(undefined)
      }
    })
  }
  )
};

export const mockNativeAes = {
  pbkdf2: jest.fn(() => Promise.resolve(mockPbkdf2Key)),
  encrypt: jest.fn(() => Promise.resolve(mockEncryptedString)),
  decrypt: jest.fn(() => Promise.resolve(mockUnencryptedString)),
  randomKey: jest.fn(() => Promise.resolve(mockRandomKey))
}

NativeModules.RNPermissions = {};
NativeModules.Themis = mockNativeThemis;
NativeModules.Aes = mockNativeAes;
