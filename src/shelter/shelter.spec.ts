import { switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { AccountTypeEnum } from '../enums/account-type.enum';
import { TempleChainKind } from '../enums/temple-chain-kind.enum';
import { mockAccountCredentials, mockHDAccountCredentials } from '../mocks/account-credentials.mock';
import {
  mockCorrectPassword,
  mockCorrectUserCredentials,
  mockCorrectUserCredentialsValue,
  mockKeychain
} from '../mocks/react-native-keychain.mock';
import {
  mockCorrectDecryptResult,
  mockCorrectPasswordHash,
  mockCryptoUtil,
  mockEncryptedData
} from '../utils/crypto.util.mock';
import { getBiometryKeychainOptions, getKeychainOptions, PASSWORD_STORAGE_KEY } from '../utils/keychain.utils';
import { rxJsTestingHelper } from '../utils/testing.utils';

import { Shelter } from './shelter';

// Shelter version in these tests doesn't matter, so we can set it to 0
describe('Shelter', () => {
  const mockIncorrectPassword = 'mockIncorrectPassword';
  const mockEvmCredentials = {
    address: '0xfDc237eff648793c9F3B976c702493f0EE056489',
    publicKey:
      '0x0499d1bccb7edd00944e5c0aec8375dc99faae3bbf1680b43facf89ad68f228592fd7118af99ae94d632b2a96593b8440253d8f4933c02b8725a97daa57d9a1aa9',
    privateKey: '0x3925ef64b24414526bd9d28826c642a34d4d8fbb292b467a33f5376126632d3d'
  };
  const mockEvmCredentialsIndex77 = {
    address: '0x05441Dc088bBa47F65B246fe3E03afd83339FF0C',
    publicKey:
      '0x0490601ea5b84fb9f95c35c2f0fea034f4acb535b0c1dfd0a603bc0f194ae24f51c9e3805162bfa761c9cef502744fad7d9ab3249a3cb2fb2846de12e7222044c9',
    privateKey: '0x88ce2f7f5f97cf5459da917e795cad4a67c027a5daa6124291b24488a7a28060'
  };

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
      Shelter.unlockApp$(mockIncorrectPassword, mockAccountCredentials.publicKeyHash, undefined)
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
      Shelter.unlockApp$(mockCorrectPassword, mockAccountCredentials.publicKeyHash, undefined)
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
      Shelter.unlockApp$(mockCorrectPassword, mockAccountCredentials.publicKeyHash, undefined)
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
          rxJsTestingHelper(([accounts, isLocked]) => {
            expect(accounts?.[0].name).toEqual('Account 1');
            expect(accounts?.[0].type).toEqual(AccountTypeEnum.HD_ACCOUNT);
            expect(accounts?.[0].publicKey).toEqual(mockAccountCredentials.publicKey);
            expect(accounts?.[0].publicKeyHash).toEqual(mockAccountCredentials.publicKeyHash);
            expect(accounts?.[0]).toMatchObject({
              id: mockAccountCredentials.publicKeyHash,
              walletId: 'default-hd-wallet',
              hdIndex: 0,
              tezosAddress: mockAccountCredentials.publicKeyHash,
              evmAddress: mockEvmCredentials.address
            });

            expect(mockCryptoUtil.encryptString$).toHaveBeenCalledWith(
              mockAccountCredentials.seedPhrase,
              mockCorrectPasswordHash
            );
            expect(mockKeychain.setGenericPassword).toHaveBeenCalledWith(
              'seedPhrase',
              JSON.stringify(mockEncryptedData),
              getKeychainOptions('seedPhrase', 0)
            );
            expect(mockKeychain.setGenericPassword).toHaveBeenCalledWith(
              'wallet_mnemonic_default-hd-wallet',
              JSON.stringify(mockEncryptedData),
              getKeychainOptions('wallet_mnemonic_default-hd-wallet', 0)
            );
            expect(mockKeychain.setGenericPassword).toHaveBeenCalledWith(
              `account_private_key_${mockAccountCredentials.publicKeyHash}`,
              JSON.stringify(mockEncryptedData),
              getKeychainOptions(`account_private_key_${mockAccountCredentials.publicKeyHash}`, 0)
            );
            expect(mockKeychain.setGenericPassword).toHaveBeenCalledWith(
              `account_public_key_${mockAccountCredentials.publicKeyHash}`,
              JSON.stringify(mockEncryptedData),
              getKeychainOptions(`account_public_key_${mockAccountCredentials.publicKeyHash}`, 0)
            );
            expect(mockKeychain.setGenericPassword).toHaveBeenCalledWith(
              `account_private_key_${mockEvmCredentials.address}`,
              JSON.stringify(mockEncryptedData),
              getKeychainOptions(`account_private_key_${mockEvmCredentials.address}`, 0)
            );
            expect(mockKeychain.setGenericPassword).toHaveBeenCalledWith(
              `account_public_key_${mockEvmCredentials.address}`,
              JSON.stringify(mockEncryptedData),
              getKeychainOptions(`account_public_key_${mockEvmCredentials.address}`, 0)
            );

            expect(isLocked).toEqual(false);
          }, done)
        );
    });

    it('should not import HD account with wrong mnemonic', done => {
      const incorrectSeedPhraseMock = 'Lorem ipsum dolor sit amet consectetur adipiscing elit donec iaculis libero et';

      Shelter.importHdAccount$(incorrectSeedPhraseMock, mockCorrectPassword).subscribe({
        error: err => {
          expect(err.message).toBe('Mnemonic not validated');
          done();
        }
      });
    });

    it('should create HD account', done => {
      const mockName = 'mockName';

      Shelter.unlockApp$(mockCorrectPassword, mockAccountCredentials.publicKeyHash, undefined)
        .pipe(
          tap(() => mockCryptoUtil.decryptString$.mockResolvedValueOnce(mockAccountCredentials.seedPhrase)),
          switchMap(() =>
            Shelter.createHdAccount$(mockName, { accountIndex: mockHDAccountCredentials.mockAccountIndex })
          )
        )
        .subscribe(
          rxJsTestingHelper(account => {
            expect(account?.name).toEqual(mockName);
            expect(account?.type).toEqual(AccountTypeEnum.HD_ACCOUNT);
            expect(account?.publicKey).toEqual(mockHDAccountCredentials.publicKey);
            expect(account?.publicKeyHash).toEqual(mockHDAccountCredentials.publicKeyHash);
            expect(account?.evmAddress).toEqual(mockEvmCredentialsIndex77.address);

            expect(mockCryptoUtil.encryptString$).toHaveBeenCalledWith(
              mockHDAccountCredentials.privateKey,
              mockCorrectPasswordHash
            );
            expect(mockKeychain.setGenericPassword).toHaveBeenCalledWith(
              mockHDAccountCredentials.publicKeyHash,
              JSON.stringify(mockEncryptedData),
              getKeychainOptions(mockHDAccountCredentials.publicKeyHash, 0)
            );
            expect(mockKeychain.setGenericPassword).toHaveBeenCalledWith(
              `account_private_key_${mockEvmCredentialsIndex77.address}`,
              JSON.stringify(mockEncryptedData),
              getKeychainOptions(`account_private_key_${mockEvmCredentialsIndex77.address}`, 0)
            );
          }, done)
        );
    });

    it('should skip automatic HD creation on imported EVM address collision', done => {
      Shelter.unlockApp$(mockCorrectPassword, mockAccountCredentials.publicKeyHash, undefined)
        .pipe(
          tap(() => mockCryptoUtil.decryptString$.mockResolvedValueOnce(mockAccountCredentials.seedPhrase)),
          switchMap(() =>
            Shelter.createHdAccount$('mockName', {
              accountIndex: mockHDAccountCredentials.mockAccountIndex,
              existingAccounts: [
                {
                  id: mockEvmCredentialsIndex77.address,
                  name: 'Imported EVM',
                  type: AccountTypeEnum.IMPORTED_ACCOUNT,
                  publicKey: '',
                  publicKeyHash: '',
                  chain: TempleChainKind.EVM,
                  address: mockEvmCredentialsIndex77.address
                }
              ]
            })
          )
        )
        .subscribe(
          rxJsTestingHelper(account => {
            expect(account).toBeUndefined();
            expect(mockKeychain.setGenericPassword).not.toHaveBeenCalledWith(
              `account_private_key_${mockEvmCredentialsIndex77.address}`,
              JSON.stringify(mockEncryptedData),
              getKeychainOptions(`account_private_key_${mockEvmCredentialsIndex77.address}`, 0)
            );
          }, done)
        );
    });

    it('should throw on explicit HD index collision', done => {
      Shelter.unlockApp$(mockCorrectPassword, mockAccountCredentials.publicKeyHash, undefined)
        .pipe(
          tap(() => mockCryptoUtil.decryptString$.mockResolvedValueOnce(mockAccountCredentials.seedPhrase)),
          switchMap(() =>
            Shelter.createHdAccount$('mockName', {
              accountIndex: mockHDAccountCredentials.mockAccountIndex,
              existingAccounts: [
                {
                  id: mockEvmCredentialsIndex77.address,
                  name: 'Imported EVM',
                  type: AccountTypeEnum.IMPORTED_ACCOUNT,
                  publicKey: '',
                  publicKeyHash: '',
                  chain: TempleChainKind.EVM,
                  address: mockEvmCredentialsIndex77.address
                }
              ],
              explicitAccountIndex: true
            })
          )
        )
        .subscribe({
          error: err => {
            expect(err.message).toEqual('Account already exists');
            done();
          }
        });
    });

    it('should create Imported account', done => {
      const mockName = 'mockName';

      Shelter.unlockApp$(mockCorrectPassword, mockAccountCredentials.publicKeyHash, undefined)
        .pipe(switchMap(() => Shelter.createImportedAccount$(mockHDAccountCredentials.privateKey, mockName)))
        .subscribe(
          rxJsTestingHelper(account => {
            expect(account?.name).toEqual(mockName);
            expect(account?.type).toEqual(AccountTypeEnum.IMPORTED_ACCOUNT);
            expect(account?.publicKey).toEqual(mockHDAccountCredentials.publicKey);
            expect(account?.publicKeyHash).toEqual(mockHDAccountCredentials.publicKeyHash);

            expect(mockCryptoUtil.encryptString$).toHaveBeenCalledWith(
              mockHDAccountCredentials.privateKey,
              mockCorrectPasswordHash
            );
            expect(mockKeychain.setGenericPassword).toHaveBeenCalledWith(
              mockHDAccountCredentials.publicKeyHash,
              JSON.stringify(mockEncryptedData),
              getKeychainOptions(mockHDAccountCredentials.publicKeyHash, 0)
            );
          }, done)
        );
    });

    it('should reveal HD account seed phrase', done => {
      Shelter.unlockApp$(mockCorrectPassword, mockAccountCredentials.publicKeyHash, undefined)
        .pipe(switchMap(() => Shelter.revealSeedPhrase$()))
        .subscribe(
          rxJsTestingHelper(decryptResult => {
            expect(decryptResult).toEqual(mockCorrectDecryptResult);

            expect(mockCryptoUtil.decryptString$).toHaveBeenCalledWith(
              mockCorrectUserCredentialsValue,
              mockCorrectPasswordHash
            );
            expect(mockKeychain.getGenericPassword).toHaveBeenCalledWith(getKeychainOptions('seedPhrase', 0));
          }, done)
        );
    });

    it('should reveal HD wallet mnemonic', done => {
      Shelter.unlockApp$(mockCorrectPassword, mockAccountCredentials.publicKeyHash, undefined)
        .pipe(switchMap(() => Shelter.revealWalletMnemonic$('default-hd-wallet')))
        .subscribe(
          rxJsTestingHelper(decryptResult => {
            expect(decryptResult).toEqual(mockCorrectDecryptResult);

            expect(mockKeychain.getGenericPassword).toHaveBeenCalledWith(
              getKeychainOptions('wallet_mnemonic_default-hd-wallet', 0)
            );
          }, done)
        );
    });

    it('should reveal account private key', done => {
      Shelter.unlockApp$(mockCorrectPassword, mockAccountCredentials.publicKeyHash, undefined)
        .pipe(switchMap(() => Shelter.revealSecretKey$(mockAccountCredentials.publicKeyHash)))
        .subscribe(
          rxJsTestingHelper(decryptResult => {
            expect(decryptResult).toEqual(mockAccountCredentials.privateKey);

            expect(mockCryptoUtil.decryptString$).toHaveBeenCalledWith(
              mockCorrectUserCredentialsValue,
              mockCorrectPasswordHash
            );
            expect(mockKeychain.getGenericPassword).toHaveBeenCalledWith(
              getKeychainOptions(`account_private_key_${mockAccountCredentials.publicKeyHash}`, 0)
            );
          }, done)
        );
    });

    it('should fall back to legacy Tezos private key reveal', done => {
      mockKeychain.getGenericPassword.mockResolvedValueOnce(false).mockResolvedValueOnce(mockCorrectUserCredentials);

      Shelter.revealSecretKey$(mockAccountCredentials.publicKeyHash, mockCorrectPasswordHash).subscribe(
        rxJsTestingHelper(decryptResult => {
          expect(decryptResult).toEqual(mockAccountCredentials.privateKey);

          expect(mockKeychain.getGenericPassword).toHaveBeenCalledWith(
            getKeychainOptions(`account_private_key_${mockAccountCredentials.publicKeyHash}`, 0)
          );
          expect(mockKeychain.getGenericPassword).toHaveBeenCalledWith(
            getKeychainOptions(mockAccountCredentials.publicKeyHash, 0)
          );
        }, done)
      );
    });

    it('should reveal account public key', done => {
      Shelter.unlockApp$(mockCorrectPassword, mockAccountCredentials.publicKeyHash, undefined)
        .pipe(switchMap(() => Shelter.revealAccountPublicKey$(mockAccountCredentials.publicKeyHash)))
        .subscribe(
          rxJsTestingHelper(decryptResult => {
            expect(decryptResult).toEqual(mockCorrectDecryptResult);

            expect(mockKeychain.getGenericPassword).toHaveBeenCalledWith(
              getKeychainOptions(`account_public_key_${mockAccountCredentials.publicKeyHash}`, 0)
            );
          }, done)
        );
    });

    it('should return signer with private key', done => {
      Shelter.unlockApp$(mockCorrectPassword, mockAccountCredentials.publicKeyHash, undefined)
        .pipe(switchMap(() => Shelter.getSigner$(mockAccountCredentials.publicKeyHash)))
        .subscribe(
          rxJsTestingHelper(async signer => {
            await expect(signer.secretKey()).resolves.toEqual(mockAccountCredentials.privateKey);
            await expect(signer.publicKey()).resolves.toEqual(mockAccountCredentials.publicKey);
            await expect(signer.publicKeyHash()).resolves.toEqual(mockAccountCredentials.publicKeyHash);

            expect(mockCryptoUtil.decryptString$).toHaveBeenCalledWith(
              mockCorrectUserCredentialsValue,
              mockCorrectPasswordHash
            );
            expect(mockKeychain.getGenericPassword).toHaveBeenCalledWith(
              getKeychainOptions(`account_private_key_${mockAccountCredentials.publicKeyHash}`, 0)
            );
          }, done)
        );
    });
  });

  describe('biometry', () => {
    it('should save password into Keychain if biometry enabled', done => {
      Shelter.enableBiometryPassword$(mockCorrectPassword).subscribe(
        rxJsTestingHelper(() => {
          expect(mockKeychain.setGenericPassword).toHaveBeenCalledWith(
            PASSWORD_STORAGE_KEY,
            JSON.stringify(mockCorrectPassword),
            {
              ...getBiometryKeychainOptions(0),
              authenticationPrompt: { cancel: 'Cancel', title: 'Authenticate to enable biometry' }
            }
          );
        }, done)
      );
    });

    it('should not save password into Keychain if biometry disabled', done => {
      mockKeychain.getSupportedBiometryType.mockReturnValue(Promise.resolve());

      Shelter.enableBiometryPassword$(mockCorrectPassword).subscribe(
        rxJsTestingHelper(() => {
          expect(mockKeychain.setGenericPassword).not.toHaveBeenCalled();
        }, done)
      );
    });

    it('should reveal password from Keychain', async () => {
      await expect(Shelter.getBiometryPassword()).resolves.toEqual(mockCorrectUserCredentials);
      expect(mockKeychain.getGenericPassword).toHaveBeenCalledWith(getBiometryKeychainOptions(0));
    });

    it('should remove password from Keychain', done => {
      Shelter.disableBiometryPassword$().subscribe(
        rxJsTestingHelper(() => {
          expect(mockKeychain.resetGenericPassword).toHaveBeenCalledWith(getKeychainOptions(PASSWORD_STORAGE_KEY, 0));
        }, done)
      );
    });
  });

  describe('password check', () => {
    it('should return "false" for empty string & locked app', done => {
      Shelter.isPasswordCorrect$('').subscribe(
        rxJsTestingHelper(isPasswordCorrect => {
          expect(isPasswordCorrect).toEqual(false);
        }, done)
      );
    });

    it('should return "false" for incorrect password & locked app', done => {
      Shelter.isPasswordCorrect$(mockIncorrectPassword).subscribe(
        rxJsTestingHelper(isPasswordCorrect => {
          expect(isPasswordCorrect).toEqual(false);
        }, done)
      );
    });

    it('should return "false" for correct password & locked app', done => {
      Shelter.isPasswordCorrect$(mockCorrectPassword).subscribe(
        rxJsTestingHelper(isPasswordCorrect => {
          expect(isPasswordCorrect).toEqual(false);
        }, done)
      );
    });

    it('should return "false" for empty string & unlocked app', done => {
      Shelter.unlockApp$(mockCorrectPassword, mockAccountCredentials.publicKeyHash, undefined)
        .pipe(switchMap(() => Shelter.isPasswordCorrect$('')))
        .subscribe(
          rxJsTestingHelper(isPasswordCorrect => {
            expect(isPasswordCorrect).toEqual(false);
          }, done)
        );
    });

    it('should return "false" for correct password & unlocked app', done => {
      Shelter.unlockApp$(mockCorrectPassword, mockAccountCredentials.publicKeyHash, undefined)
        .pipe(switchMap(() => Shelter.isPasswordCorrect$(mockIncorrectPassword)))
        .subscribe(
          rxJsTestingHelper(isPasswordCorrect => {
            expect(isPasswordCorrect).toEqual(false);
          }, done)
        );
    });

    it('should return "true" for correct password & unlocked app', done => {
      Shelter.unlockApp$(mockCorrectPassword, mockAccountCredentials.publicKeyHash, undefined)
        .pipe(switchMap(() => Shelter.isPasswordCorrect$(mockCorrectPassword)))
        .subscribe(
          rxJsTestingHelper(isPasswordCorrect => {
            expect(isPasswordCorrect).toEqual(true);
          }, done)
        );
    });
  });
});
