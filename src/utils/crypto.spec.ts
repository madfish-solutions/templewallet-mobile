// import { mockUint8DerivedString, mockUint8RandomValues } from '../mocks/crypto.mock';
import {
  mockCorrectPassword,
  mockCorrectPbkdf2Key,
  mockEncryptedString,
  mockNativeAes,
  mockRandomKey,
  mockUnencryptedString
} from '../mocks/native-modules.mock';
import { decryptString$, encryptString$, generateRandomValues } from './crypto.util';
import { rxJsTestingHelper } from './testing.utis';

describe('generateRandomValues', () => {
  const getRandomValuesMock = crypto.getRandomValues as jest.Mock;
  beforeEach(() => {
    getRandomValuesMock.mockClear();
  });

  it('should generate 16 cryptographically safe random bytes by default', () => {
    const output = generateRandomValues();
    expect(output).toHaveLength(16);
    expect(getRandomValuesMock).toBeCalledWith(output);
  });

  it('should generate another amount of random bytes if specified', () => {
    const expectedAmount = 12;
    const output = generateRandomValues(expectedAmount);
    expect(output).toHaveLength(expectedAmount);
    expect(getRandomValuesMock).toBeCalledWith(output);
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
  encryptString$(mockUnencryptedString, mockCorrectPassword).subscribe(
    rxJsTestingHelper(encryptionOutput => {
      expect(encryptionOutput).toEqual(expectedEncryptionOutput);
      expect(mockNativeAes.pbkdf2).toBeCalledWith(mockCorrectPassword, expectedSalt, 5000, 256);
      expect(mockNativeAes.randomKey).toBeCalledWith(16);
      expect(mockNativeAes.encrypt).toBeCalledWith(mockUnencryptedString, mockCorrectPbkdf2Key, mockRandomKey);
    }, done)
  );
});

it('decryptString$ should decrypt a message with correct password', done => {
  decryptString$(expectedEncryptionOutput, mockCorrectPassword).subscribe(
    rxJsTestingHelper(decryptionOutput => {
      expect(mockNativeAes.pbkdf2).toBeCalledWith(mockCorrectPassword, expectedEncryptionOutput.salt, 5000, 256);
      expect(mockNativeAes.decrypt).toBeCalledWith(
        expectedEncryptionOutput.cipher,
        mockCorrectPbkdf2Key,
        expectedEncryptionOutput.iv
      );
      expect(decryptionOutput).toEqual(mockUnencryptedString);
    }, done)
  );
});

it('decryptString$ should return undefined if a password is incorrect', done => {
  decryptString$(expectedEncryptionOutput, 'incorrectPassword').subscribe(
    rxJsTestingHelper(decryptionOutput => {
      expect(decryptionOutput).toBeUndefined();
    }, done)
  );
});
