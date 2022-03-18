export const mockSymmetricKey64 = 'BQD4WGMsvr/AICOKuua79o9jorgLmGS3QmLjtR3NrSs=';
export const mockUnencryptedString = 'testString';
export const mockEncryptedString = 'encryptedString';
export const mockPassphrase = 'correctPassword';

/* eslint-disable  @typescript-eslint/no-unused-vars */
export const mockReactNativeThemis = {
  symmetricKey64: jest.fn(() => Promise.resolve(mockSymmetricKey64)),
  secureCellSealWithPassphraseEncrypt64: jest.fn((passphrase: string, plaintext: string, context: string) =>
    Promise.resolve(mockEncryptedString)
  ),
  secureCellSealWithPassphraseDecrypt64: jest.fn((passphrase: string, encrypted64: string, context: string) => {
    return new Promise((resolve, reject) => {
      if (passphrase === mockPassphrase) {
        resolve(mockUnencryptedString);
      } else {
        reject(undefined);
      }
    });
  })
};

jest.mock('react-native-themis', () => mockReactNativeThemis);
