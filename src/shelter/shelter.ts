import { InMemorySigner } from '@taquito/signer';
import { mnemonicToSeedSync } from 'bip39';
import { range } from 'lodash-es';
import Keychain from 'react-native-keychain';
import { BehaviorSubject, forkJoin, from, Observable, of, throwError, firstValueFrom } from 'rxjs';
import { catchError, map, mapTo, switchMap } from 'rxjs/operators';

import { AccountTypeEnum } from '../enums/account-type.enum';
import { AccountInterface } from '../interfaces/account.interface';
import {
  decryptString$,
  EncryptedData,
  EncryptedDataSalt,
  encryptPass$,
  encryptString$,
  withEncryptedPass$
} from '../utils/crypto.util';
import { isDefined } from '../utils/is-defined';
import {
  APP_IDENTIFIER,
  biometryKeychainOptions,
  getKeychainOptions,
  PASSWORD_CHECK_KEY,
  PASSWORD_STORAGE_KEY
} from '../utils/keychain.utils';
import { getDerivationPath, getPublicKeyAndHash$, seedToPrivateKey } from '../utils/keys.util';

const EMPTY_PASSWORD = '';

export class Shelter {
  private static _hash$ = new BehaviorSubject(EMPTY_PASSWORD);

  private static saveSensitiveData$ = (data: Record<string, string>) =>
    forkJoin(
      Object.entries(data).map(entry =>
        of(entry).pipe(
          switchMap(([key, value]) =>
            encryptString$(value, Shelter._hash$.getValue()).pipe(
              switchMap(encryptedData =>
                Keychain.setGenericPassword(key, JSON.stringify(encryptedData), getKeychainOptions(key))
              )
            )
          ),
          switchMap(result => (result === false ? throwError('Failed to save sensitive data') : of(result)))
        )
      )
    );

  private static decryptSensitiveData$ = (key: string, hash: string) =>
    from(Keychain.getGenericPassword(getKeychainOptions(key))).pipe(
      switchMap(rawKeychainData =>
        rawKeychainData === false ? throwError(`No record in Keychain [${key}]`) : of(rawKeychainData)
      ),
      map((rawKeychainData): EncryptedData & EncryptedDataSalt => JSON.parse(rawKeychainData.password)),
      switchMap(keychainData => decryptString$(keychainData, hash)),
      switchMap(value => (value === undefined ? throwError(`Failed to decrypt value [${key}]`) : of(value)))
    );

  static isLocked$ = Shelter._hash$.pipe(map(password => password === EMPTY_PASSWORD));

  static getIsLocked = () => Shelter._hash$.getValue() === EMPTY_PASSWORD;

  static lockApp = () => Shelter._hash$.next(EMPTY_PASSWORD);

  static unlockApp$ = (password: string) =>
    Shelter.verifyPassword$(password).pipe(
      map(value => {
        console.log('[unlockApp$]', value);
        if (value) {
          encryptPass$(password).subscribe(encrypted => {
            Shelter._hash$.next(encrypted);
          });

          return true;
        }

        return false;
      }),
      catchError(() => of(false))
    );

  static verifyPassword$ = (password: string) =>
    from(Keychain.getGenericPassword(getKeychainOptions(PASSWORD_CHECK_KEY))).pipe(
      switchMap(rawKeychainData => {
        console.log('[Keychain]', rawKeychainData);

        return rawKeychainData === false
          ? throwError(`No record in Keychain [${PASSWORD_CHECK_KEY}]`)
          : of(rawKeychainData);
      }),
      map((rawKeychainData): EncryptedData & EncryptedDataSalt => JSON.parse(rawKeychainData.password)),
      switchMap(keychainData =>
        withEncryptedPass$(keychainData, password).pipe(
          switchMap(([keychainData, hash]) => {
            console.log('[withEncryptedPass$]', [keychainData, hash]);

            return decryptString$(keychainData, password);
          }),
          switchMap(value => {
            console.log('[after decryptString$]', value);

            // return throwError(`Failed to decrypt value [${PASSWORD_CHECK_KEY}]`)
            return value === undefined ? throwError(`Failed to decrypt value [${PASSWORD_CHECK_KEY}]`) : of(value);
          }),
          map(value => {
            if (value === APP_IDENTIFIER) {
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
    encryptPass$(password).subscribe(encrypted => {
      Shelter._hash$.next(encrypted);
    });

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
              [PASSWORD_CHECK_KEY]: APP_IDENTIFIER
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
    ).pipe(catchError(() => of(undefined)));
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
    Shelter.decryptSensitiveData$(publicKeyHash, Shelter._hash$.getValue()).pipe(
      switchMap(privateKeySeed => InMemorySigner.fromSecretKey(privateKeySeed)),
      switchMap(signer => signer.secretKey()),
      catchError(() => of(undefined))
    );

  static revealSeedPhrase$ = () => Shelter.decryptSensitiveData$('seedPhrase', Shelter._hash$.getValue());

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

  static isPasswordCorrect = async (password: string) => {
    const isNotEmpty = password !== EMPTY_PASSWORD && Shelter._hash$.getValue() !== EMPTY_PASSWORD;
    const isCorrect = await firstValueFrom(Shelter.verifyPassword$(password));

    return isCorrect && isNotEmpty;
  };
}
