import { switchMap, tap, withLatestFrom } from 'rxjs/operators';

import '../utils/keychain.utils.mock';

import { AccountTypeEnum } from '../enums/account-type.enum';
import { mockAccountCredentials, mockHDAccountCredentials } from '../mocks/account-credentials.mock';
import {
  mockCorrectPassword,
  mockCorrectUserCredentials,
  mockCorrectUserCredentialsValue,
  mockKeychain
} from '../mocks/react-native-keychain.mock';
import { mockCorrectDecryptResult, mockCryptoUtil, mockEncryptedData } from '../utils/crypto.util.mock';
import { biometryKeychainOptions, getKeychainOptions, PASSWORD_STORAGE_KEY } from '../utils/keychain.utils';
import { rxJsTestingHelper } from '../utils/testing.utis';
import { Shelter } from './shelter';

describe('Shelter', () => {
  const mockIncorrectPassword = 'mockIncorrectPassword';

  beforeEach(() => {
    Shelter.lockApp();
    jest.clearAllMocks();
  });

  describe('app lock', () => {
    it('should initially lock app & be unable to decrypt data', done => {
      Shelter.revealSecretKey$(mockAccountCredentials.publicKeyHash)
        .pipe(withLatestFrom(Shelter.isLocked$))
        .subscribe(
          rxJsTestingHelper(([decryptResult, isLocked]) => {
            expect(decryptResult).toBeUndefined();
            expect(isLocked).toEqual(true);
          }, done)
        );
    });

    it('should not unlock app with incorrect password & be unable to decrypt data', done => {
      Shelter.unlockApp$(mockIncorrectPassword)
        .pipe(
          switchMap(() =>
            Shelter.revealSecretKey$(mockAccountCredentials.publicKeyHash).pipe(withLatestFrom(Shelter.isLocked$))
          )
        )
        .subscribe(
          rxJsTestingHelper(([decryptResult, isLocked]) => {
            expect(decryptResult).toBeUndefined();
            expect(isLocked).toEqual(true);
          }, done)
        );
    });

    it('should unlock app with correct password & be able to decrypt data', done => {
      Shelter.unlockApp$(mockCorrectPassword)
        .pipe(
          switchMap(() =>
            Shelter.revealSecretKey$(mockAccountCredentials.publicKeyHash).pipe(withLatestFrom(Shelter.isLocked$))
          )
        )
        .subscribe(
          rxJsTestingHelper(([decryptResult, isLocked]) => {
            expect(decryptResult).toEqual(mockAccountCredentials.privateKey);
            expect(isLocked).toEqual(false);
          }, done)
        );
    });

    it('should lock app & be unable to decrypt data', done => {
      Shelter.unlockApp$(mockCorrectPassword)
        .pipe(
          switchMap(() =>
            Shelter.revealSecretKey$(mockAccountCredentials.publicKeyHash).pipe(withLatestFrom(Shelter.isLocked$))
          ),
          tap(([decryptResult, isLocked]) => {
            expect(decryptResult).toEqual(mockAccountCredentials.privateKey);
            expect(isLocked).toEqual(false);
          }),
          switchMap(() => {
            Shelter.lockApp();

            return Shelter.revealSecretKey$(mockAccountCredentials.publicKeyHash).pipe(
              withLatestFrom(Shelter.isLocked$)
            );
          })
        )
        .subscribe(
          rxJsTestingHelper(([decryptResult, isLocked]) => {
            expect(decryptResult).toBeUndefined();
            expect(isLocked).toEqual(true);
          }, done)
        );
    });
  });

  describe('accounts management', () => {
    it('should import HD account & unlock app', done => {
      Shelter.importHdAccount$(mockAccountCredentials.seedPhrase, mockCorrectPassword)
        .pipe(withLatestFrom(Shelter.isLocked$))
        .subscribe(
          rxJsTestingHelper(([account, isLocked]) => {
            expect(account?.name).toEqual('Account 1');
            expect(account?.type).toEqual(AccountTypeEnum.HD_ACCOUNT);
            expect(account?.publicKey).toEqual(mockAccountCredentials.publicKey);
            expect(account?.publicKeyHash).toEqual(mockAccountCredentials.publicKeyHash);

            expect(mockCryptoUtil.encryptString$).toBeCalledWith(
              mockAccountCredentials.seedPhrase,
              mockCorrectPassword
            );
            expect(mockKeychain.setGenericPassword).toBeCalledWith(
              'seedPhrase',
              JSON.stringify(mockEncryptedData),
              getKeychainOptions('seedPhrase')
            );

            expect(isLocked).toEqual(false);
          }, done)
        );
    });

    it('should create HD account', done => {
      const mockName = 'mockName';

      Shelter.unlockApp$(mockCorrectPassword)
        .pipe(switchMap(() => Shelter.createHdAccount$(mockName, mockHDAccountCredentials.mockAccountIndex)))
        .subscribe(
          rxJsTestingHelper(account => {
            expect(account?.name).toEqual(mockName);
            expect(account?.type).toEqual(AccountTypeEnum.HD_ACCOUNT);
            expect(account?.publicKey).toEqual(mockHDAccountCredentials.publicKey);
            expect(account?.publicKeyHash).toEqual(mockHDAccountCredentials.publicKeyHash);

            expect(mockCryptoUtil.encryptString$).toBeCalledWith(
              mockHDAccountCredentials.privateKey,
              mockCorrectPassword
            );
            expect(mockKeychain.setGenericPassword).toBeCalledWith(
              mockHDAccountCredentials.publicKeyHash,
              JSON.stringify(mockEncryptedData),
              getKeychainOptions(mockHDAccountCredentials.publicKeyHash)
            );
          }, done)
        );
    });

    it('should create Imported account', done => {
      const mockName = 'mockName';

      Shelter.unlockApp$(mockCorrectPassword)
        .pipe(switchMap(() => Shelter.createImportedAccount$(mockHDAccountCredentials.privateKey, mockName)))
        .subscribe(
          rxJsTestingHelper(account => {
            expect(account?.name).toEqual(mockName);
            expect(account?.type).toEqual(AccountTypeEnum.IMPORTED_ACCOUNT);
            expect(account?.publicKey).toEqual(mockHDAccountCredentials.publicKey);
            expect(account?.publicKeyHash).toEqual(mockHDAccountCredentials.publicKeyHash);

            expect(mockCryptoUtil.encryptString$).toBeCalledWith(
              mockHDAccountCredentials.privateKey,
              mockCorrectPassword
            );
            expect(mockKeychain.setGenericPassword).toBeCalledWith(
              mockHDAccountCredentials.publicKeyHash,
              JSON.stringify(mockEncryptedData),
              getKeychainOptions(mockHDAccountCredentials.publicKeyHash)
            );
          }, done)
        );
    });

    it('should reveal HD account seed phrase', done => {
      Shelter.unlockApp$(mockCorrectPassword)
        .pipe(switchMap(() => Shelter.revealSeedPhrase$()))
        .subscribe(
          rxJsTestingHelper(decryptResult => {
            expect(decryptResult).toEqual(mockCorrectDecryptResult);

            expect(mockCryptoUtil.decryptString$).toBeCalledWith(mockCorrectUserCredentialsValue, mockCorrectPassword);
            expect(mockKeychain.getGenericPassword).toBeCalledWith(getKeychainOptions('seedPhrase'));
          }, done)
        );
    });

    it('should reveal account private key', done => {
      Shelter.unlockApp$(mockCorrectPassword)
        .pipe(switchMap(() => Shelter.revealSecretKey$(mockAccountCredentials.publicKeyHash)))
        .subscribe(
          rxJsTestingHelper(decryptResult => {
            expect(decryptResult).toEqual(mockAccountCredentials.privateKey);

            expect(mockCryptoUtil.decryptString$).toBeCalledWith(mockCorrectUserCredentialsValue, mockCorrectPassword);
            expect(mockKeychain.getGenericPassword).toBeCalledWith(
              getKeychainOptions(mockAccountCredentials.publicKeyHash)
            );
          }, done)
        );
    });

    it('should return signer with private key', done => {
      Shelter.unlockApp$(mockCorrectPassword)
        .pipe(switchMap(() => Shelter.getSigner$(mockAccountCredentials.publicKeyHash)))
        .subscribe(
          rxJsTestingHelper(async signer => {
            await expect(signer.secretKey()).resolves.toEqual(mockAccountCredentials.privateKey);
            await expect(signer.publicKey()).resolves.toEqual(mockAccountCredentials.publicKey);
            await expect(signer.publicKeyHash()).resolves.toEqual(mockAccountCredentials.publicKeyHash);

            expect(mockCryptoUtil.decryptString$).toBeCalledWith(mockCorrectUserCredentialsValue, mockCorrectPassword);
            expect(mockKeychain.getGenericPassword).toBeCalledWith(
              getKeychainOptions(mockAccountCredentials.publicKeyHash)
            );
          }, done)
        );
    });
  });

  describe('biometry', () => {
    it('should save password into Keychain if biometry enabled', done => {
      Shelter.enableBiometryPassword$(mockCorrectPassword).subscribe(
        rxJsTestingHelper(() => {
          expect(mockKeychain.setGenericPassword).toBeCalledWith(
            PASSWORD_STORAGE_KEY,
            JSON.stringify(mockCorrectPassword),
            biometryKeychainOptions
          );
        }, done)
      );
    });

    it('should not save password into Keychain if biometry disabled', done => {
      mockKeychain.getSupportedBiometryType.mockReturnValue(Promise.resolve());

      Shelter.enableBiometryPassword$(mockCorrectPassword).subscribe(
        rxJsTestingHelper(() => {
          expect(mockKeychain.setGenericPassword).not.toBeCalled();
        }, done)
      );
    });

    it('should reveal password from Keychain', async () => {
      await expect(Shelter.getBiometryPassword()).resolves.toEqual(mockCorrectUserCredentials);
      expect(mockKeychain.getGenericPassword).toBeCalledWith(biometryKeychainOptions);
    });

    it('should remove password from Keychain', done => {
      Shelter.disableBiometryPassword$().subscribe(
        rxJsTestingHelper(() => {
          expect(mockKeychain.resetGenericPassword).toBeCalledWith(getKeychainOptions(PASSWORD_STORAGE_KEY));
        }, done)
      );
    });
  });

  describe('password check', () => {
    it('should return "false" for empty string & locked app', () => {
      expect(Shelter.isPasswordCorrect('')).toEqual(false);
    });

    it('should return "false" for incorrect password & locked app', () => {
      expect(Shelter.isPasswordCorrect(mockIncorrectPassword)).toEqual(false);
    });

    it('should return "false" for correct password & locked app', () => {
      expect(Shelter.isPasswordCorrect(mockCorrectPassword)).toEqual(false);
    });

    it('should return "false" for empty string & unlocked app', done => {
      Shelter.unlockApp$(mockCorrectPassword).subscribe(
        rxJsTestingHelper(() => {
          expect(Shelter.isPasswordCorrect('')).toEqual(false);
        }, done)
      );
    });

    it('should return "false" for correct password & unlocked app', done => {
      Shelter.unlockApp$(mockCorrectPassword).subscribe(
        rxJsTestingHelper(() => {
          expect(Shelter.isPasswordCorrect(mockIncorrectPassword)).toEqual(false);
        }, done)
      );
    });

    it('should return "true" for correct password & unlocked app', done => {
      Shelter.unlockApp$(mockCorrectPassword).subscribe(
        rxJsTestingHelper(() => {
          expect(Shelter.isPasswordCorrect(mockCorrectPassword)).toEqual(true);
        }, done)
      );
    });
  });
});
