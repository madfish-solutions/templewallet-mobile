import { InMemorySigner } from '@taquito/signer';
import { mnemonicToSeedSync } from 'bip39';
import * as Keychain from 'react-native-keychain';
import { BehaviorSubject, forkJoin, from, Observable, of, throwError } from 'rxjs';
import { catchError, map, mapTo, switchMap } from 'rxjs/operators';

import { AccountInterface } from '../interfaces/account.interface';
import { decryptString$, EncryptedData, EncryptedDataSalt, encryptString$ } from '../utils/crypto.util';
import { isDefined } from '../utils/is-defined';
import {
  APP_IDENTIFIER,
  biometryKeychainOptions,
  getKeychainOptions,
  PASSWORD_CHECK_KEY,
  PASSWORD_STORAGE_KEY
} from '../utils/keychain.utils';
import { getPublicKeyAndHash$, seedToHDPrivateKey } from '../utils/keys.util';

const EMPTY_PASSWORD = '';

export class Shelter {
  private static _password$ = new BehaviorSubject(EMPTY_PASSWORD);

  private static saveSensitiveData$ = (data: Record<string, string>) =>
    forkJoin(
      Object.entries(data).map(entry =>
        of(entry).pipe(
          switchMap(([key, value]) =>
            encryptString$(value, Shelter._password$.getValue()).pipe(
              switchMap(encryptedData =>
                Keychain.setGenericPassword(key, JSON.stringify(encryptedData), getKeychainOptions(key))
              )
            )
          ),
          switchMap(result => (result === false ? throwError('Failed to save sensitive data') : of(result)))
        )
      )
    );

  private static decryptSensitiveData$ = (key: string, password: string) =>
    from(Keychain.getGenericPassword(getKeychainOptions(key))).pipe(
      switchMap(rawKeychainData =>
        rawKeychainData === false ? throwError(`No record in Keychain [${key}]`) : of(rawKeychainData)
      ),
      map((rawKeychainData): EncryptedData & EncryptedDataSalt => JSON.parse(rawKeychainData.password)),
      switchMap(keychainData => decryptString$(keychainData, password)),
      switchMap(value => (value === undefined ? throwError(`Failed to decrypt value [${key}]`) : of(value)))
    );

  static _isLocked$ = Shelter._password$.pipe(map(password => password === EMPTY_PASSWORD));

  static lockApp = () => Shelter._password$.next(EMPTY_PASSWORD);

  static unlockApp$ = (password: string) =>
    Shelter.decryptSensitiveData$(PASSWORD_CHECK_KEY, password).pipe(
      map(value => {
        if (value === APP_IDENTIFIER) {
          Shelter._password$.next(password);

          return true;
        }

        return false;
      }),
      catchError(() => of(false))
    );

  static importHdAccount$ = (seedPhrase: string, password: string): Observable<AccountInterface | undefined> => {
    Shelter._password$.next(password);

    const seed = mnemonicToSeedSync(seedPhrase);
    const privateKey = seedToHDPrivateKey(seed, 0);

    return getPublicKeyAndHash$(privateKey).pipe(
      switchMap(([publicKey, publicKeyHash]) =>
        Shelter.saveSensitiveData$({
          seedPhrase,
          [publicKeyHash]: privateKey,
          [PASSWORD_CHECK_KEY]: APP_IDENTIFIER
        }).pipe(
          mapTo({
            name: 'Account 1',
            publicKey,
            publicKeyHash
          })
        )
      ),
      catchError(() => of(undefined))
    );
  };

  static createHdAccount$ = (name: string, accountIndex: number): Observable<AccountInterface | undefined> =>
    Shelter.revealSeedPhrase$().pipe(
      switchMap(seedPhrase => {
        const seed = mnemonicToSeedSync(seedPhrase);
        const privateKey = seedToHDPrivateKey(seed, accountIndex);

        return getPublicKeyAndHash$(privateKey).pipe(
          switchMap(([publicKey, publicKeyHash]) =>
            Shelter.saveSensitiveData$({ [publicKeyHash]: privateKey }).pipe(
              mapTo({
                name,
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
    Shelter.decryptSensitiveData$(publicKeyHash, Shelter._password$.getValue()).pipe(
      switchMap(privateKeySeed => InMemorySigner.fromSecretKey(privateKeySeed)),
      switchMap(signer => signer.secretKey()),
      catchError(() => of(undefined))
    );

  static revealSeedPhrase$ = () => Shelter.decryptSensitiveData$('seedPhrase', Shelter._password$.getValue());

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

  static isPasswordCorrect = (password: string) => password === Shelter._password$.getValue();
}
