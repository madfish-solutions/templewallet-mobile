import { mockCrypto } from '../../jest.setup';
import {
  mockPbkdf2Key,
  mockEncryptedString,
  mockNativeAes,
  mockRandomKey,
  mockUnencryptedString
} from '../mocks/native-modules.mock';
import { decryptString$, encryptString$, generateRandomValues } from './crypto.util';
import { rxJsTestingHelper } from './testing.utis';

describe('generateRandomValues', () => {
  beforeEach(() => {
    mockCrypto.getRandomValues.mockClear();
  });

  it('should generate 16 cryptographically safe random bytes by default', () => {
    const output = generateRandomValues();
    expect(output).toHaveLength(16);
    expect(mockCrypto.getRandomValues).toBeCalledWith(output);
  });

  it('should generate another amount of random bytes if specified', () => {
    const expectedAmount = 12;
    const output = generateRandomValues(expectedAmount);
    expect(output).toHaveLength(expectedAmount);
    expect(mockCrypto.getRandomValues).toBeCalledWith(output);
  });
});

beforeEach(() => {
  mockNativeAes.decrypt.mockClear();
  mockNativeAes.encrypt.mockClear();
  mockNativeAes.pbkdf2.mockClear();
});

const expectedSalt = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';

const expectedEncryptionOutput = { cipher: mockEncryptedString, iv: mockRandomKey, salt: expectedSalt };

it('encryptString$ should encrypt a message with a given password', done => {
  encryptString$(mockUnencryptedString, 'correctPassword').subscribe(
    rxJsTestingHelper(encryptionOutput => {
      expect(encryptionOutput).toEqual(expectedEncryptionOutput);
      expect(mockNativeAes.pbkdf2).toBeCalledWith('correctPassword', expectedSalt, 5000, 256);
      expect(mockNativeAes.randomKey).toBeCalledWith(16);
      expect(mockNativeAes.encrypt).toBeCalledWith(mockUnencryptedString, mockPbkdf2Key, mockRandomKey);
    }, done)
  );
});

it('decryptString$ should decrypt a message with correct password', done => {
  decryptString$(expectedEncryptionOutput, 'correctPassword').subscribe(
    rxJsTestingHelper(decryptionOutput => {
      expect(mockNativeAes.pbkdf2).toBeCalledWith('correctPassword', expectedEncryptionOutput.salt, 5000, 256);
      expect(mockNativeAes.decrypt).toBeCalledWith(
        expectedEncryptionOutput.cipher,
        mockPbkdf2Key,
        expectedEncryptionOutput.iv
      );
      expect(decryptionOutput).toEqual(mockUnencryptedString);
    }, done)
  );
});

it('decryptString$ should return undefined if a password is incorrect', done => {
  mockNativeAes.decrypt.mockImplementationOnce(() => Promise.reject());
  decryptString$(expectedEncryptionOutput, 'incorrectPassword').subscribe(
    rxJsTestingHelper(decryptionOutput => {
      expect(decryptionOutput).toBeUndefined();
    }, done)
  );
});
