import { InMemorySigner } from '@taquito/signer';
import { mnemonicToSeedSync } from 'bip39';
import * as Keychain from 'react-native-keychain';
import { UserCredentials } from 'react-native-keychain';
import { BehaviorSubject, forkJoin, from, Observable, of } from 'rxjs';
import { filter, map, mapTo, switchMap } from 'rxjs/operators';

import { AccountInterface } from '../interfaces/account.interface';
import { decryptString$, EncryptedData, EncryptedDataSalt, encryptString$ } from '../utils/crypto.util';
import { getPublicKeyAndHash$, seedToHDPrivateKey } from '../utils/keys.util';

export const APP_IDENTIFIER = 'com.madfish-solutions.temple-mobile';
const PASSWORD_CHECK_KEY = 'app-password';
const EMPTY_PASSWORD = '';

const getKeychainOptions = (key: string): Keychain.Options => ({
  service: `${APP_IDENTIFIER}/${key}`
});

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
          )
        )
      )
    );

  private static decryptSensitiveData$ = (key: string, password: string) =>
    from(Keychain.getGenericPassword(getKeychainOptions(key))).pipe(
      filter((rawKeychainData): rawKeychainData is UserCredentials => rawKeychainData !== false),
      map((rawKeychainData): EncryptedData & EncryptedDataSalt => JSON.parse(rawKeychainData.password)),
      switchMap(keychainData => decryptString$(keychainData, password)),
      filter((decryptedString): decryptedString is string => decryptedString !== undefined)
    );

  static _isLocked$ = Shelter._password$.pipe(map(password => password === EMPTY_PASSWORD));

  static lockApp = () => Shelter._password$.next(EMPTY_PASSWORD);

  static unlockApp$ = (password: string) =>
    Shelter.decryptSensitiveData$(PASSWORD_CHECK_KEY, password).pipe(
      map(value => {
        if (value !== undefined && value === APP_IDENTIFIER) {
          Shelter._password$.next(password);

          return true;
        }

        return false;
      })
    );

  static importHdAccount$ = (seedPhrase: string, password: string): Observable<AccountInterface> => {
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
      )
    );
  };

  static createHdAccount$ = (name: string, accountIndex: number): Observable<AccountInterface> =>
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
          )
        );
      })
    );

  static revealSecretKey$ = (publicKeyHash: string) =>
    Shelter.decryptSensitiveData$(publicKeyHash, Shelter._password$.getValue()).pipe(
      switchMap(privateKeySeed => InMemorySigner.fromSecretKey(privateKeySeed)),
      switchMap(signer => signer.secretKey())
    );

  static revealSeedPhrase$ = () => Shelter.decryptSensitiveData$('seedPhrase', Shelter._password$.getValue());
}
