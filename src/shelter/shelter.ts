import { InMemorySigner } from '@taquito/signer';
import { mnemonicToSeedSync } from 'bip39';
import ReactNativeBiometrics from 'react-native-biometrics';
import * as Keychain from 'react-native-keychain';
import { BehaviorSubject, forkJoin, from, Observable, of, throwError } from 'rxjs';
import { catchError, map, mapTo, switchMap } from 'rxjs/operators';

import { AccountInterface } from '../interfaces/account.interface';
import { decryptString$, EncryptedData, EncryptedDataSalt, encryptString$ } from '../utils/crypto.util';
import { isDefined } from '../utils/is-defined';
import { getPublicKeyAndHash$, seedToHDPrivateKey } from '../utils/keys.util';

export const APP_IDENTIFIER = 'com.madfish-solutions.temple-mobile';
const PASSWORD_CHECK_KEY = 'app-password';
const PASSWORD_STORAGE_KEY = 'biometry-protected-app-password';
const EMPTY_PASSWORD = '';

const getKeychainOptions = (key: string, useBiometry?: boolean): Keychain.Options => ({
  service: `${APP_IDENTIFIER}/${key}`,
  accessControl: useBiometry ? Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET : undefined,
  authenticationType: useBiometry ? Keychain.AUTHENTICATION_TYPE.BIOMETRICS : undefined
});

export class Shelter {
  private static _password$ = new BehaviorSubject(EMPTY_PASSWORD);

  private static saveSensitiveData$ = (data: Record<string, string>, useBiometry?: boolean) =>
    forkJoin(
      Object.entries(data).map(entry =>
        of(entry).pipe(
          switchMap(([key, value]) =>
            useBiometry
              ? Keychain.setGenericPassword(key, JSON.stringify(value), getKeychainOptions(key, true))
              : encryptString$(value, Shelter._password$.getValue()).pipe(
                  switchMap(encryptedData =>
                    Keychain.setGenericPassword(key, JSON.stringify(encryptedData), getKeychainOptions(key))
                  )
                )
          ),
          switchMap(result => (result === false ? throwError('Failed to save sensitive data') : of(result)))
        )
      )
    );

  private static decryptSensitiveData$ = (key: string, password?: string) => {
    if (isDefined(password)) {
      return from(Keychain.getGenericPassword(getKeychainOptions(key))).pipe(
        switchMap(rawKeychainData =>
          rawKeychainData === false ? throwError(`No record in Keychain [${key}]`) : of(rawKeychainData)
        ),
        map((rawKeychainData): EncryptedData & EncryptedDataSalt => JSON.parse(rawKeychainData.password)),
        switchMap(keychainData => decryptString$(keychainData, password)),
        switchMap(value => (value === undefined ? throwError(`Failed to decrypt value [${key}]`) : of(value)))
      );
    }

    return from(Keychain.getGenericPassword(getKeychainOptions(key, true))).pipe(
      switchMap(keychainData =>
        keychainData === false ? throwError(`No record in Keychain [${key}]`) : of(JSON.parse(keychainData.password))
      )
    );
  };

  private static biometryIsAvailable = async () => {
    try {
      const biometryType = await Keychain.getSupportedBiometryType();
      if (!biometryType) {
        throw new Error('Biometrics is not available');
      }

      return { available: true };
    } catch (e) {
      return { available: false, error: e };
    }
  };

  static passwordIsValid = (password: string) => Shelter._password$.getValue() === password;

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
          switchMap(result => {
            if (isDefined(result)) {
              return Shelter.saveSensitiveData$({ [PASSWORD_STORAGE_KEY]: password }, true);
            }

            return of(true);
          }),
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

  static unlockAppWithBiometry$ = () =>
    from(Shelter.biometryIsAvailable()).pipe(
      switchMap(({ available, error }) => {
        if (!available) {
          return throwError(error);
        }

        return from(ReactNativeBiometrics.biometricKeysExist());
      }),
      switchMap(({ keysExist }) => {
        if (!keysExist) {
          throw new Error("Biometry keys don't exist");
        }

        return from(
          ReactNativeBiometrics.createSignature({
            promptMessage: 'Sign in',
            payload: 'message_payload'
          })
        );
      }),
      switchMap(({ success, error }) => {
        if (error) {
          throw new Error(error);
        }

        if (!success) {
          return of(false);
        }

        return Shelter.decryptSensitiveData$(PASSWORD_STORAGE_KEY).pipe(switchMap(value => Shelter.unlockApp$(value)));
      }),
      catchError(error => of(error as Error))
    );
}
