import AsyncStorage from '@react-native-async-storage/async-storage';
import { InMemorySigner } from '@taquito/signer';
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from 'bip39';
import { range } from 'lodash-es';
import Keychain from 'react-native-keychain';
import { BehaviorSubject, firstValueFrom, forkJoin, from, Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap } from 'rxjs/operators';

import { AccountTypeEnum } from '../enums/account-type.enum';
import { AccountInterface } from '../interfaces/account.interface';
import { decryptString$, EncryptedData, encryptString$, hashPassword$ } from '../utils/crypto.util';
import { isDefined } from '../utils/is-defined';
import {
  getBiometryKeychainOptions,
  getKeychainOptions,
  PASSWORD_CHECK_KEY,
  PASSWORD_STORAGE_KEY,
  shouldUseOnlySoftwareInV1
} from '../utils/keychain.utils';
import { getDerivationPath, getPublicKeyAndHash$, seedToPrivateKey } from '../utils/keys.util';
import { throwError$ } from '../utils/rxjs.utils';

const EMPTY_PASSWORD_HASH = '';
const SHELTER_VERSION_STORAGE_KEY = 'shelterVersion';

export class Shelter {
  private static migrateFromChip$ = () =>
    forkJoin([Keychain.getAllGenericPasswordServices(), Shelter.getShelterVersion()]).pipe(
      switchMap(([passwordServices, shelterVersion]) =>
        forkJoin(
          passwordServices.map(async passwordService => {
            console.log(`Copying ${passwordService}`);
            const isBiometryService = passwordService === getBiometryKeychainOptions(0).service;
            const password = isBiometryService
              ? await Keychain.getGenericPassword(getBiometryKeychainOptions(shelterVersion))
              : await Keychain.getGenericPassword(getKeychainOptions(passwordService, shelterVersion));
            console.log(passwordService, isBiometryService, password, shelterVersion);

            if (password === false) {
              throw new Error('Failed to get password from Keychain');
            }

            await Keychain.setGenericPassword(
              passwordService,
              password.password,
              isBiometryService
                ? getBiometryKeychainOptions(shelterVersion + 1)
                : getKeychainOptions(password.password, shelterVersion + 1)
            );
          })
        ).pipe(
          switchMap(() =>
            forkJoin(
              passwordServices.map(async passwordService => {
                console.log(`Removing ${passwordService} from chip`);
                const isBiometryService = passwordService === getBiometryKeychainOptions(0).service;
                const key = passwordService.split('/').slice(1).join('/');
                console.log(passwordService, isBiometryService, key);

                await Keychain.resetGenericPassword(
                  isBiometryService
                    ? getBiometryKeychainOptions(shelterVersion)
                    : getKeychainOptions(key, shelterVersion)
                );
              })
            )
          )
        )
      )
    );

  private static migrateFromSamsungOrGoogleChip$ = () =>
    shouldUseOnlySoftwareInV1 ? Shelter.migrateFromChip$() : of(undefined);

  private static migrations = [Shelter.migrateFromSamsungOrGoogleChip$];
  private static targetShelterVersion = Shelter.migrations.length;

  private static getShelterVersion = async () => {
    const rawStoredVersion = await AsyncStorage.getItem(SHELTER_VERSION_STORAGE_KEY);
    const shelterIsEmpty = (await Keychain.getAllGenericPasswordServices()).length === 0;

    return Number(rawStoredVersion ?? (shelterIsEmpty ? 0 : Shelter.migrations.length));
  };

  private static setShelterVersion = (version: number) =>
    AsyncStorage.setItem(SHELTER_VERSION_STORAGE_KEY, String(version));

  private static _passwordHash$ = new BehaviorSubject(EMPTY_PASSWORD_HASH);

  private static saveSensitiveData$ = (data: Record<string, string>) =>
    from(Shelter.getShelterVersion()).pipe(
      switchMap(shelterVersion =>
        forkJoin(
          Object.entries(data).map(async ([key, value]) => {
            const encryptedData = await firstValueFrom(encryptString$(value, Shelter._passwordHash$.getValue()));
            const result = await Keychain.setGenericPassword(
              key,
              JSON.stringify(encryptedData),
              getKeychainOptions(key, shelterVersion)
            );

            if (result === false) {
              throw new Error('Failed to save sensitive data');
            }

            return result;
          })
        )
      )
    );

  private static decryptSensitiveData$ = (key: string, passwordHash: string) =>
    from(Shelter.getShelterVersion()).pipe(
      switchMap(shelterVersion => from(Keychain.getGenericPassword(getKeychainOptions(key, shelterVersion)))),
      switchMap(rawKeychainData =>
        rawKeychainData === false ? throwError$(`No record in Keychain [${key}]`) : of(rawKeychainData)
      ),
      map((rawKeychainData): EncryptedData => JSON.parse(rawKeychainData.password)),
      switchMap(keychainData => decryptString$(keychainData, passwordHash)),
      switchMap(value => (value === undefined ? throwError$(`Failed to decrypt value [${key}]`) : of(value)))
    );

  static shouldDoSomeMigrations = async () => (await Shelter.getShelterVersion()) < Shelter.targetShelterVersion;

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
      return throwError$('Mnemonic not validated');
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
      catchError(error => {
        console.error(error);

        return of(undefined);
      })
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
      switchMap(value => (value === undefined ? throwError$('Failed to reveal private key') : of(value))),
      map(privateKey => new InMemorySigner(privateKey))
    );

  static enableBiometryPassword$ = (password: string, shelterVersion?: number) =>
    forkJoin([Shelter.getShelterVersion(), Keychain.getSupportedBiometryType()]).pipe(
      switchMap(([fallbackShelterVersion, supportedBiometryType]) =>
        isDefined(supportedBiometryType)
          ? Keychain.setGenericPassword(
              PASSWORD_STORAGE_KEY,
              JSON.stringify(password),
              getBiometryKeychainOptions(shelterVersion ?? fallbackShelterVersion)
            )
          : of(false)
      ),
      catchError(() => of(false))
    );

  static disableBiometryPassword$ = () =>
    from(Shelter.getShelterVersion()).pipe(
      switchMap(shelterVersion =>
        from(Keychain.resetGenericPassword(getKeychainOptions(PASSWORD_STORAGE_KEY, shelterVersion)))
      )
    );

  static getBiometryPassword = async () =>
    Shelter.getShelterVersion().then(shelterVersion =>
      Keychain.getGenericPassword(getBiometryKeychainOptions(shelterVersion))
    );

  static isPasswordCorrect$ = (password: string) =>
    hashPassword$(password).pipe(map(passwordHash => passwordHash === Shelter._passwordHash$.getValue()));

  static doMigrations$ = () => {
    return from(Shelter.getShelterVersion()).pipe(
      switchMap(shelterVersion =>
        range(shelterVersion, Shelter.targetShelterVersion).reduce<Observable<void>>(
          (acc, version) =>
            acc.pipe(
              switchMap(() => Shelter.migrations[version]()),
              switchMap(() => from(Shelter.setShelterVersion(version + 1)))
            ),
          of(undefined)
        )
      )
    );
  };
}
