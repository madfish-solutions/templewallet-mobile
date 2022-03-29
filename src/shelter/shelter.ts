import { InMemorySigner } from '@taquito/signer';
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from 'bip39';
import { range } from 'lodash-es';
import Keychain from 'react-native-keychain';
import { BehaviorSubject, forkJoin, from, Observable, of, throwError } from 'rxjs';
import { catchError, map, mapTo, switchMap } from 'rxjs/operators';

import { AccountTypeEnum } from '../enums/account-type.enum';
import { AccountInterface } from '../interfaces/account.interface';
import { decryptString$, EncryptedData, encryptString$, hashPassword$ } from '../utils/crypto.util';
import { isDefined } from '../utils/is-defined';
import {
  biometryKeychainOptions,
  getKeychainOptions,
  PASSWORD_CHECK_KEY,
  PASSWORD_STORAGE_KEY
} from '../utils/keychain.utils';
import { getDerivationPath, getPublicKeyAndHash$, seedToPrivateKey } from '../utils/keys.util';

const EMPTY_PASSWORD_HASH = '';

export class Shelter {
  private static _passwordHash$ = new BehaviorSubject(EMPTY_PASSWORD_HASH);

  private static saveSensitiveData$ = (data: Record<string, string>) =>
    forkJoin(
      Object.entries(data).map(entry =>
        of(entry).pipe(
          switchMap(([key, value]) =>
            encryptString$(value, Shelter._passwordHash$.getValue()).pipe(
              switchMap(encryptedData =>
                Keychain.setGenericPassword(key, JSON.stringify(encryptedData), getKeychainOptions(key))
              )
            )
          ),
          switchMap(result => (result === false ? throwError('Failed to save sensitive data') : of(result)))
        )
      )
    );

  private static decryptSensitiveData$ = (key: string, passwordHash: string) =>
    from(Keychain.getGenericPassword(getKeychainOptions(key))).pipe(
      switchMap(rawKeychainData =>
        rawKeychainData === false ? throwError(`No record in Keychain [${key}]`) : of(rawKeychainData)
      ),
      map((rawKeychainData): EncryptedData => JSON.parse(rawKeychainData.password)),
      switchMap(keychainData => decryptString$(keychainData, passwordHash)),
      switchMap(value => (value === undefined ? throwError(`Failed to decrypt value [${key}]`) : of(value)))
    );

  static isLocked$ = Shelter._passwordHash$.pipe(map(password => password === EMPTY_PASSWORD_HASH));

  static getIsLocked = () => Shelter._passwordHash$.getValue() === EMPTY_PASSWORD_HASH;

  static lockApp = () => Shelter._passwordHash$.next(EMPTY_PASSWORD_HASH);

  static unlockApp$ = (password: string) =>
    hashPassword$(password).pipe(
      switchMap(passwordHash =>
        Shelter.decryptSensitiveData$(PASSWORD_CHECK_KEY, passwordHash).pipe(
          map(value => {
            if (value !== null) {
              Shelter._passwordHash$.next(passwordHash);

              return true;
            }

            return false;
          }),
          catchError(() => of(false))
        )
      )
    );

  static importHdAccount$ = (
    seedPhrase: string,
    password: string,
    hdAccountsLength = 1
  ): Observable<AccountInterface[] | undefined> => {
    if (!validateMnemonic(seedPhrase)) {
      return throwError('Mnemonic not validated');
    }

    return hashPassword$(password).pipe(
      switchMap(passwordHash => {
        Shelter._passwordHash$.next(passwordHash);

        const seed = mnemonicToSeedSync(seedPhrase);

        return forkJoin(
          range(0, hdAccountsLength).map(hdAccountIndex => {
            const privateKey = seedToPrivateKey(seed, getDerivationPath(hdAccountIndex));
            const name = `Account ${hdAccountIndex + 1}`;

            return getPublicKeyAndHash$(privateKey).pipe(
              switchMap(([publicKey, publicKeyHash]) =>
                Shelter.saveSensitiveData$({
                  seedPhrase,
                  [publicKeyHash]: privateKey,
                  [PASSWORD_CHECK_KEY]: generateMnemonic(128)
                }).pipe(
                  mapTo({
                    type: AccountTypeEnum.HD_ACCOUNT,
                    name,
                    publicKey,
                    publicKeyHash
                  })
                )
              )
            );
          })
        );
      }),
      catchError(() => of(undefined))
    );
  };

  static createImportedAccount$ = (privateKey: string, name: string) =>
    getPublicKeyAndHash$(privateKey).pipe(
      switchMap(([publicKey, publicKeyHash]) =>
        Shelter.saveSensitiveData$({
          [publicKeyHash]: privateKey
        }).pipe(
          mapTo({
            name,
            type: AccountTypeEnum.IMPORTED_ACCOUNT,
            publicKey,
            publicKeyHash
          })
        )
      )
    );

  static createHdAccount$ = (name: string, accountIndex: number): Observable<AccountInterface | undefined> =>
    Shelter.revealSeedPhrase$().pipe(
      switchMap(seedPhrase => {
        const seed = mnemonicToSeedSync(seedPhrase);
        const privateKey = seedToPrivateKey(seed, getDerivationPath(accountIndex));

        return getPublicKeyAndHash$(privateKey).pipe(
          switchMap(([publicKey, publicKeyHash]) =>
            Shelter.saveSensitiveData$({ [publicKeyHash]: privateKey }).pipe(
              mapTo({
                name,
                type: AccountTypeEnum.HD_ACCOUNT,
                publicKey,
                publicKeyHash
              })
            )
          ),
          catchError(() => of(undefined))
        );
      })
    );

  static revealSecretKey$ = (publicKeyHash: string) =>
    Shelter.decryptSensitiveData$(publicKeyHash, Shelter._passwordHash$.getValue()).pipe(
      switchMap(privateKeySeed => InMemorySigner.fromSecretKey(privateKeySeed)),
      switchMap(signer => signer.secretKey()),
      catchError(() => of(undefined))
    );

  static revealSeedPhrase$ = () => Shelter.decryptSensitiveData$('seedPhrase', Shelter._passwordHash$.getValue());

  static getSigner$ = (publicKeyHash: string) =>
    Shelter.revealSecretKey$(publicKeyHash).pipe(
      switchMap(value => (value === undefined ? throwError('Failed to reveal private key') : of(value))),
      map(privateKey => new InMemorySigner(privateKey))
    );

  static enableBiometryPassword$ = (password: string) =>
    from(Keychain.getSupportedBiometryType()).pipe(
      switchMap(supportedBiometryType =>
        isDefined(supportedBiometryType)
          ? Keychain.setGenericPassword(PASSWORD_STORAGE_KEY, JSON.stringify(password), biometryKeychainOptions)
          : of(false)
      ),
      catchError(() => of(false))
    );

  static disableBiometryPassword$ = () => from(Keychain.resetGenericPassword(getKeychainOptions(PASSWORD_STORAGE_KEY)));

  static getBiometryPassword = () => Keychain.getGenericPassword(biometryKeychainOptions);

  static isPasswordCorrect$ = (password: string) =>
    hashPassword$(password).pipe(map(passwordHash => passwordHash === Shelter._passwordHash$.getValue()));
}
