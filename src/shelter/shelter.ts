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
  getGenericPasswordOptions,
  getKeychainOptions,
  PASSWORD_CHECK_KEY,
  PASSWORD_STORAGE_KEY,
  SHELTER_VERSION_STORAGE_KEY,
  shouldMoveToSoftwareInV1
} from '../utils/keychain.utils';
import { getDerivationPath, getPublicKeyAndHash$, seedToPrivateKey } from '../utils/keys.util';
import { throwError$ } from '../utils/rxjs.utils';

const EMPTY_PASSWORD_HASH = '';
const FATAL_MIGRATION_ERROR_MESSAGE = 'Please, reset your wallet to complete migration';
const MIGRATION_ERROR_MESSAGE = 'Please try again on the next launch.';

interface PasswordServiceMigrationResultBase {
  isSuccess: boolean;
  error?: unknown;
  readPassword: false | Keychain.UserCredentials;
}

interface SuccessPasswordServiceMigrationResult extends PasswordServiceMigrationResultBase {
  isSuccess: true;
  error?: undefined;
  readPassword: Keychain.UserCredentials;
}

interface FailedPasswordServiceMigrationResult extends PasswordServiceMigrationResultBase {
  isSuccess: false;
}

type PasswordServiceMigrationResult = SuccessPasswordServiceMigrationResult | FailedPasswordServiceMigrationResult;

export class Shelter {
  private static revertMigrationFromChip = async (
    passwordServices: string[],
    migrationResults: PasswordServiceMigrationResult[]
  ) => {
    const shelterVersion = await Shelter.getShelterVersion();

    await Promise.all(
      passwordServices.map(async (passwordService, index) => {
        const migrationResult = migrationResults[index];
        const oldPasswordServiceOptions = getGenericPasswordOptions(passwordService, shelterVersion);

        if (migrationResult.isSuccess) {
          const { username, password } = migrationResult.readPassword;
          const result = await Keychain.setGenericPassword(username, password, oldPasswordServiceOptions);

          if (result === false) {
            throw new Error(FATAL_MIGRATION_ERROR_MESSAGE);
          }
        } else if (isDefined(migrationResult.error)) {
          const { error } = migrationResult;

          if (error instanceof Error) {
            console.log(JSON.stringify(Object.entries(error)), error.name);
            const errorWithCodeMatchResult = error.message.match(/^code: (\d+)/);
            const codeNumber = errorWithCodeMatchResult ? Number(errorWithCodeMatchResult[1]) : undefined;

            // A user cancelled biometric authentication
            if (codeNumber === 13) {
              return;
            }
          }

          throw new Error(FATAL_MIGRATION_ERROR_MESSAGE);
        } else {
          if (migrationResult.readPassword === false) {
            return;
          }

          const { username, password } = migrationResult.readPassword;
          const result = await Keychain.setGenericPassword(username, password, oldPasswordServiceOptions);

          if (result === false) {
            throw new Error(FATAL_MIGRATION_ERROR_MESSAGE);
          }
        }
      })
    );
  };

  private static migrateFromChip = async () => {
    const passwordServices = await Keychain.getAllGenericPasswordServices();
    const shelterVersion = await Shelter.getShelterVersion();

    const migrationResults = await Promise.all(
      passwordServices.map(async (passwordService): Promise<PasswordServiceMigrationResult> => {
        let readPassword: false | Keychain.UserCredentials = false;
        try {
          const oldPasswordServiceOptions = getGenericPasswordOptions(passwordService, shelterVersion);
          readPassword = await Keychain.getGenericPassword(oldPasswordServiceOptions);

          if (readPassword === false) {
            return { isSuccess: false, readPassword };
          }

          const newPasswordServiceOptions = getGenericPasswordOptions(passwordService, shelterVersion + 1);
          const result = await Keychain.setGenericPassword(
            readPassword.username,
            readPassword.password,
            newPasswordServiceOptions
          );

          return { isSuccess: result !== false, readPassword };
        } catch (e) {
          console.error(e, typeof e === 'object' && e ? Object.entries(e) : JSON.stringify(e));

          return { error: e, isSuccess: false, readPassword };
        }
      })
    );

    if (migrationResults.every(({ isSuccess }) => isSuccess)) {
      return;
    }

    await Shelter.revertMigrationFromChip(passwordServices, migrationResults);

    throw new Error(MIGRATION_ERROR_MESSAGE);
  };

  private static migrateFromSamsungOrGoogleChip = async () =>
    shouldMoveToSoftwareInV1 && (await Shelter.migrateFromChip());

  private static migrations = [Shelter.migrateFromSamsungOrGoogleChip];
  private static targetShelterVersion = Shelter.migrations.length;

  private static setShelterVersion = (version: number) =>
    AsyncStorage.setItem(SHELTER_VERSION_STORAGE_KEY, String(version));

  private static _passwordHash$ = new BehaviorSubject(EMPTY_PASSWORD_HASH);

  private static saveSensitiveData$ = (data: Record<string, string>) =>
    Shelter.getShelterVersion$().pipe(
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
    Shelter.getShelterVersion$().pipe(
      switchMap(shelterVersion => from(Keychain.getGenericPassword(getKeychainOptions(key, shelterVersion)))),
      switchMap(rawKeychainData =>
        rawKeychainData === false ? throwError$(`No record in Keychain [${key}]`) : of(rawKeychainData)
      ),
      map((rawKeychainData): EncryptedData => JSON.parse(rawKeychainData.password)),
      switchMap(keychainData => decryptString$(keychainData, passwordHash)),
      switchMap(value => (value === undefined ? throwError$(`Failed to decrypt value [${key}]`) : of(value)))
    );

  static getShelterVersion = async () => {
    const rawStoredVersion = await AsyncStorage.getItem(SHELTER_VERSION_STORAGE_KEY);
    const shelterIsEmpty = (await Keychain.getAllGenericPasswordServices()).length === 0;

    return Number(rawStoredVersion ?? (shelterIsEmpty ? Shelter.migrations.length : 0));
  };

  static getShelterVersion$ = () => from(Shelter.getShelterVersion());

  static newMigrationsExist = async () => (await Shelter.getShelterVersion()) < Shelter.targetShelterVersion;

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
      switchMap(passwordHash =>
        forkJoin([Promise.resolve(passwordHash), Shelter.setShelterVersion(Shelter.targetShelterVersion)])
      ),
      switchMap(([passwordHash]) => {
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

  static enableBiometryPassword$ = (password: string) =>
    forkJoin([Shelter.getShelterVersion(), Keychain.getSupportedBiometryType()]).pipe(
      switchMap(([shelterVersion, supportedBiometryType]) =>
        isDefined(supportedBiometryType)
          ? Keychain.setGenericPassword(
              PASSWORD_STORAGE_KEY,
              JSON.stringify(password),
              getBiometryKeychainOptions(shelterVersion)
            )
          : of(false)
      ),
      catchError(() => of(false))
    );

  static disableBiometryPassword$ = () =>
    Shelter.getShelterVersion$().pipe(
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
    return Shelter.getShelterVersion$().pipe(
      switchMap(shelterVersion =>
        range(shelterVersion, Shelter.targetShelterVersion).reduce<Observable<void>>(
          (acc, version) =>
            acc.pipe(
              switchMap(() => from(Shelter.migrations[version]())),
              switchMap(() => from(Shelter.setShelterVersion(version + 1)))
            ),
          of(undefined)
        )
      )
    );
  };
}
