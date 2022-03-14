import {
  mockEncryptedString,
  mockNativeThemis,
  mockUnencryptedString,
  mockSymmetricKey64,
  mockPassphrase,
} from '../mocks/native-modules.mock';

beforeEach(() => {
  mockNativeThemis.secureCellSealWithPassphraseEncrypt64.mockClear();
  mockNativeThemis.secureCellSealWithPassphraseDecrypt64.mockClear();
});

it('secureCellSealWithPassphraseEncrypt64 should encrypt a message with a given password', async () => {
  const encryptionOutput = await mockNativeThemis.secureCellSealWithPassphraseEncrypt64(mockPassphrase, mockUnencryptedString, mockSymmetricKey64)
  expect(encryptionOutput).toEqual(mockEncryptedString)
});

it('secureCellSealWithPassphraseDecrypt64 should decrypt a message with correct password', async () => {
  const decryptionOutput = await mockNativeThemis.secureCellSealWithPassphraseDecrypt64(mockPassphrase, mockEncryptedString, mockSymmetricKey64)
  expect(decryptionOutput).toEqual(mockUnencryptedString)
});

it('secureCellSealWithPassphraseDecrypt64 should return undefined if a password is incorrect', async () => {
  try {
    await mockNativeThemis.secureCellSealWithPassphraseDecrypt64('incorrectPassword', mockEncryptedString, mockSymmetricKey64)
  } catch (e) {
    expect(e).toBeUndefined();
  }
});
