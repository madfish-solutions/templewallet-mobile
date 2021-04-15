import { BehaviorSubject, forkJoin, from, Observable, Subject } from 'rxjs';
import { useEffect, useMemo, useState } from 'react';
import { ImportAccountPayload, importWalletActions } from '../store/wallet/wallet-actions';
import { useDispatch } from 'react-redux';
import * as Keychain from 'react-native-keychain';
import { UserCredentials } from 'react-native-keychain';
import { generateSeed, getPublicKeyAndHash$, seedToHDPrivateKey } from '../utils/keys.util';
import { decryptString$, EncryptedData, EncryptedDataSalt, encryptString$ } from '../utils/crypto.util';
import { filter, map, mapTo, switchMap } from 'rxjs/operators';
import { mnemonicToSeedSync } from 'bip39';

const APP_IDENTIFIER = 'com.madfish-solutions.temple-mobile';
const PASSWORD_CHECK_KEY = 'app-password';

const getKeychainOptions = (key: string): Keychain.Options => ({
  service: `${APP_IDENTIFIER}/${key}`
});

export class Shelter {
  private static _password$ = new BehaviorSubject('');

  public static _isLocked$ = Shelter._password$.pipe(map(password => password === ''));

  public static unlock$() {
    return (password$: Observable<string>) =>
      password$.pipe(
        switchMap(password =>
          Shelter.decryptValue$(PASSWORD_CHECK_KEY, password).pipe(
            map(value => {
              if (value === undefined || value !== APP_IDENTIFIER) {
                return false;
              } else {
                Shelter._password$.next(password);

                return true;
              }
            })
          )
        )
      );
  }

  public static lock() {
    Shelter._password$.next('');
  }

  public static importWallet$ = (privateData: Record<string, string>, password: string) => {
    Shelter._password$.next(password);

    return forkJoin(
      from(Object.entries({ ...privateData, [PASSWORD_CHECK_KEY]: APP_IDENTIFIER })).pipe(
        switchMap(([key, value]) =>
          encryptString$(value, Shelter._password$.getValue()).pipe(
            switchMap(encryptedData =>
              Keychain.setGenericPassword(key, JSON.stringify(encryptedData), getKeychainOptions(key))
            )
          )
        )
      )
    );
  };

  public static decryptValue$ = (key: string, password: string) =>
    from(Keychain.getGenericPassword(getKeychainOptions(key))).pipe(
      filter((rawKeychainData): rawKeychainData is UserCredentials => rawKeychainData !== false),
      map((rawKeychainData): EncryptedData & EncryptedDataSalt => JSON.parse(rawKeychainData.password)),
      switchMap(keychainData => decryptString$(keychainData, password))
    );
}

export const useShelter = () => {
  const dispatch = useDispatch();

  const [isLocked, setIsLocked] = useState(true);

  const importWallet$ = useMemo(() => new Subject<ImportAccountPayload>(), []);
  const createWallet$ = useMemo(() => new Subject<string>(), []);
  const unlock$ = useMemo(() => new Subject<string>(), []);

  useEffect(() => {
    const subscriptions = [
      Shelter._isLocked$.subscribe(value => setIsLocked(value)),
      unlock$.pipe(Shelter.unlock$()).subscribe(),
      importWallet$
        .pipe(
          switchMap(({ seedPhrase, password }) => {
            const seed = mnemonicToSeedSync(seedPhrase);
            const hdAccountIndex = 0;

            const privateKey = seedToHDPrivateKey(seed, hdAccountIndex);

            return getPublicKeyAndHash$(privateKey).pipe(
              switchMap(([publicKey, publicKeyHash]) =>
                Shelter.importWallet$(
                  {
                    seedPhrase,
                    [publicKeyHash]: privateKey
                  },
                  password
                ).pipe(
                  mapTo({
                    name: 'Account 1',
                    publicKey,
                    publicKeyHash
                  })
                )
              )
            );
          })
        )
        .subscribe(publicData => dispatch(importWalletActions.success(publicData))),

      createWallet$.subscribe(password => {
        const seedPhrase = generateSeed();

        importWallet$.next({ seedPhrase, password });
      })
    ];
    return () => {
      console.log('unsubscribe');
      subscriptions.forEach(subscription => subscription.unsubscribe());
    };
  }, [createWallet$, dispatch, importWallet$, unlock$]);

  const importWallet = (seedPhrase: string, password: string) => importWallet$.next({ seedPhrase, password });
  const createWallet = (password: string) => createWallet$.next(password);

  const lock = () => Shelter.lock();

  const unlock = (password: string) => unlock$.next(password);

  return { isLocked, importWallet, createWallet, lock, unlock };
};
