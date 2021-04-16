import { BehaviorSubject, forkJoin, from, of } from 'rxjs';
import * as Keychain from 'react-native-keychain';
import { UserCredentials } from 'react-native-keychain';
import { decryptString$, EncryptedData, EncryptedDataSalt, encryptString$ } from '../utils/crypto.util';
import { filter, map, switchMap } from 'rxjs/operators';

export const APP_IDENTIFIER = 'com.madfish-solutions.temple-mobile';
const PASSWORD_CHECK_KEY = 'app-password';
const EMPTY_PASSWORD = '';

const getKeychainOptions = (key: string): Keychain.Options => ({
  service: `${APP_IDENTIFIER}/${key}`
});

export class Shelter {
  private static _password$ = new BehaviorSubject(EMPTY_PASSWORD);

  private static decryptValue$ = (key: string, password: string) =>
    from(Keychain.getGenericPassword(getKeychainOptions(key))).pipe(
      filter((rawKeychainData): rawKeychainData is UserCredentials => rawKeychainData !== false),
      map((rawKeychainData): EncryptedData & EncryptedDataSalt => JSON.parse(rawKeychainData.password)),
      switchMap(keychainData => decryptString$(keychainData, password))
    );

  static _isLocked$ = Shelter._password$.pipe(map(password => password === EMPTY_PASSWORD));

  static lockApp = () => Shelter._password$.next(EMPTY_PASSWORD);

  static unlockApp$ = (password: string) =>
    Shelter.decryptValue$(PASSWORD_CHECK_KEY, password).pipe(
      map(value => {
        if (value !== undefined && value === APP_IDENTIFIER) {
          Shelter._password$.next(password);

          return true;
        }

        return false;
      })
    );

  static importWallet$ = (privateData: Record<string, string>, password: string) => {
    Shelter._password$.next(password);

    return forkJoin(
      Object.entries({ ...privateData, [PASSWORD_CHECK_KEY]: APP_IDENTIFIER }).map(entry =>
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
  };

  static revealValue$ = (key: string) => Shelter.decryptValue$(key, Shelter._password$.getValue());
}
