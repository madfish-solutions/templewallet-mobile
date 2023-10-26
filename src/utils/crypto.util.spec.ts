import {
  mockEncryptedString,
  mockPassphrase,
  mockReactNativeThemis,
  mockSymmetricKey64,
  mockUnencryptedString
} from '../mocks/react-native-themis.mock';

import { decryptString$, encryptString$ } from './crypto.util';
import { rxJsTestingHelper } from './testing.utils';

const expectedEncryptionOutput = { encrypted64: mockEncryptedString, salt64: mockSymmetricKey64 };

it('encryptString$ should encrypt a message with a given password', done => {
  encryptString$(mockUnencryptedString, mockPassphrase).subscribe(
    rxJsTestingHelper(encryptionOutput => {
      expect(encryptionOutput).toEqual(expectedEncryptionOutput);
      expect(mockReactNativeThemis.symmetricKey64).toBeCalledWith();
      expect(mockReactNativeThemis.secureCellSealWithPassphraseEncrypt64).toBeCalledWith(
        mockPassphrase,
        mockUnencryptedString,
        mockSymmetricKey64
      );
    }, done)
  );
});

it('decryptString$ should decrypt a message with correct password', done => {
  decryptString$(expectedEncryptionOutput, mockPassphrase).subscribe(
    rxJsTestingHelper(decryptionOutput => {
      expect(decryptionOutput).toEqual(mockUnencryptedString);
      expect(mockReactNativeThemis.secureCellSealWithPassphraseDecrypt64).toBeCalledWith(
        mockPassphrase,
        mockEncryptedString,
        mockSymmetricKey64
      );
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
