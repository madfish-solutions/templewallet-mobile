import AsyncStorage from '@react-native-async-storage/async-storage';
import { nanoid } from '@reduxjs/toolkit';
import { InMemorySigner } from '@taquito/signer';
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from 'bip39';
import { range } from 'lodash-es';
import {
  UserCredentials,
  setGenericPassword,
  getAllGenericPasswordServices,
  getGenericPassword,
  getSupportedBiometryType,
  resetGenericPassword
} from 'react-native-keychain';
import { BehaviorSubject, firstValueFrom, forkJoin, from, Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap, tap } from 'rxjs/operators';

import { AccountTypeEnum } from '../enums/account-type.enum';
import { TempleChainKind } from '../enums/temple-chain-kind.enum';
import { Account, ImportedMultichainAccount } from '../interfaces/account.interfaces';
import { getAccountAddressForChain } from '../utils/account.utils';
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
import {
  AccountCredentials,
  getEvmDerivationPath,
  getPublicKeyAndHash$,
  getTezosDerivationPath,
  mnemonicToEvmAccountCredentials,
  mnemonicToPrivateKey,
  mnemonicToTezosAccountCredentials,
  privateKeyToEvmAccountCredentials,
  privateKeyToTezosAccountCredentials,
  seedToPrivateKey
} from '../utils/keys.utils';
import { throwError$ } from '../utils/rxjs.utils';
import { extractHdIndexFromDerivationPath, getSaplingDerivationPath } from '../utils/sapling/address-utils';
import { InMemorySpendingKey } from '../utils/sapling/sapling-keys';

import { deriveSaskFromPrivateKey } from './utils/derive-sask-from-private-key.util';

const EMPTY_PASSWORD_HASH = '';
export const FATAL_MIGRATION_ERROR_MESSAGE = 'Please, reset your wallet to complete migration';
const MIGRATION_WITH_BIOMETRY_ERROR_MESSAGE = 'Confirm the migration using your biometrics and try again.';
const MIGRATION_WITHOUT_BIOMETRY_ERROR_MESSAGE = 'Please, try again.';

interface CreateHdAccountOptions {
  walletId?: string;
  accountIndex?: number;
  existingAccounts?: Account[];
  explicitAccountIndex?: boolean;
}

export interface CreateImportedMultichainAccountOptions {
  seedPhrase: string;
  name: string;
  bip39Passphrase?: string;
  chain?: TempleChainKind;
  derivationPath?: string;
}

const normalizeAddressForCompare = (chain: TempleChainKind, address: string) =>
  chain === TempleChainKind.EVM ? address.toLowerCase() : address;

const hasSameChainAddress = (accounts: Account[], chain: TempleChainKind, address: string, includeHd = true) =>
  accounts.some(account => {
    if (!includeHd && account.type === AccountTypeEnum.HD) {
      return false;
    }

    const accountAddress = getAccountAddressForChain(account, chain);

    return accountAddress
      ? normalizeAddressForCompare(chain, accountAddress) === normalizeAddressForCompare(chain, address)
      : false;
  });

interface PasswordServiceMigrationResultBase {
  isSuccess: boolean;
  error?: unknown;
  readPassword: false | UserCredentials;
}

interface SuccessPasswordServiceMigrationResult extends PasswordServiceMigrationResultBase {
  isSuccess: true;
  error?: undefined;
  readPassword: UserCredentials;
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
          const result = await setGenericPassword(username, password, oldPasswordServiceOptions);

          if (result === false) {
            throw new Error(FATAL_MIGRATION_ERROR_MESSAGE);
          }
        } else if (isDefined(migrationResult.error)) {
          const { error } = migrationResult;

          if (error instanceof Error) {
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
          const result = await setGenericPassword(username, password, oldPasswordServiceOptions);

          if (result === false) {
            throw new Error(FATAL_MIGRATION_ERROR_MESSAGE);
          }
        }
      })
    );
  };

  private static migrateFromChip = async () => {
    const passwordServices = await getAllGenericPasswordServices();
    const shelterVersion = await Shelter.getShelterVersion();
    const hasBiometry = passwordServices.some(serviceName => serviceName.includes(PASSWORD_STORAGE_KEY));

    const migrationResults = await Promise.all(
      passwordServices.map(async (passwordService): Promise<PasswordServiceMigrationResult> => {
        let readPassword: false | UserCredentials = false;
        try {
          const oldPasswordServiceOptions = getGenericPasswordOptions(passwordService, shelterVersion);
          readPassword = await getGenericPassword(oldPasswordServiceOptions);

          if (readPassword === false) {
            return { isSuccess: false, readPassword };
          }

          await resetGenericPassword(oldPasswordServiceOptions);
          const newPasswordServiceOptions = getGenericPasswordOptions(passwordService, shelterVersion + 1);
          const result = await setGenericPassword(
            readPassword.username,
            readPassword.password,
            newPasswordServiceOptions
          );

          return { isSuccess: result !== false, readPassword };
        } catch (e) {
          return { error: e, isSuccess: false, readPassword };
        }
      })
    );

    if (migrationResults.every(({ isSuccess }) => isSuccess)) {
      return;
    }

    await Shelter.revertMigrationFromChip(passwordServices, migrationResults);

    throw new Error(hasBiometry ? MIGRATION_WITH_BIOMETRY_ERROR_MESSAGE : MIGRATION_WITHOUT_BIOMETRY_ERROR_MESSAGE);
  };

  private static migrateFromSamsungOrGoogleChip = async () =>
    shouldMoveToSoftwareInV1 && (await Shelter.migrateFromChip());

  private static migrations = [Shelter.migrateFromSamsungOrGoogleChip];
  private static targetShelterVersion = Shelter.migrations.length;

  private static setShelterVersion = (version: number) =>
    AsyncStorage.setItem(SHELTER_VERSION_STORAGE_KEY, String(version));

  private static _passwordHash$ = new BehaviorSubject(EMPTY_PASSWORD_HASH);

  private static saveSensitiveData$ = (data: Record<string, string>, passwordHash?: string) =>
    Shelter.getShelterVersion$().pipe(
      switchMap(shelterVersion =>
        forkJoin(
          Object.entries(data).map(async ([key, value]) => {
            const encryptedData = await firstValueFrom(
              encryptString$(value, passwordHash ?? Shelter._passwordHash$.getValue())
            );
            const result = await setGenericPassword(
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
      switchMap(shelterVersion => from(getGenericPassword(getKeychainOptions(key, shelterVersion)))),
      switchMap(rawKeychainData =>
        rawKeychainData === false ? throwError$(`No record in Keychain [${key}]`) : of(rawKeychainData)
      ),
      map((rawKeychainData): EncryptedData => JSON.parse(rawKeychainData.password)),
      switchMap(keychainData => decryptString$(keychainData, passwordHash)),
      switchMap(value => (value === undefined ? throwError$(`Failed to decrypt value [${key}]`) : of(value)))
    );

  static getShelterVersion = async () => {
    const rawStoredVersion = await AsyncStorage.getItem(SHELTER_VERSION_STORAGE_KEY);

    if (isDefined(rawStoredVersion)) {
      return Number(rawStoredVersion);
    }

    // TODO: modify the logic as new version appears if necessary
    const passwordCheckKey = await getGenericPassword(getKeychainOptions(PASSWORD_CHECK_KEY, 0));
    const shelterIsEmpty = passwordCheckKey === false;

    return shelterIsEmpty ? Shelter.migrations.length : 0;
  };

  static getShelterVersion$ = () => from(Shelter.getShelterVersion());

  static newMigrationsExist = async () => (await Shelter.getShelterVersion()) < Shelter.targetShelterVersion;

  static isLocked$ = Shelter._passwordHash$.pipe(map(password => password === EMPTY_PASSWORD_HASH));

  static getIsLocked = () => Shelter._passwordHash$.getValue() === EMPTY_PASSWORD_HASH;

  static lockApp = () => Shelter._passwordHash$.next(EMPTY_PASSWORD_HASH);

  static saveAccountCredentials$ = (credentials: AccountCredentials, passwordHash?: string) =>
    Shelter.saveSensitiveData$(
      {
        [credentials.address]: credentials.privateKey
      },
      passwordHash
    );

  static revealAccountPrivateKey$ = (address: string, passwordHash?: string) =>
    Shelter.decryptSensitiveData$(address, passwordHash ?? Shelter._passwordHash$.getValue());

  private static deriveAndSaveHdAccount$ = ({
    seedPhrase,
    name,
    hdIndex,
    passwordHash
  }: {
    seedPhrase: string;
    name: string;
    hdIndex: number;
    passwordHash?: string;
  }) =>
    forkJoin([
      from(mnemonicToTezosAccountCredentials(seedPhrase, hdIndex)),
      from(Promise.resolve().then(() => mnemonicToEvmAccountCredentials(seedPhrase, hdIndex)))
    ]).pipe(
      switchMap(([tezosCredentials, evmCredentials]) =>
        forkJoin([
          InMemorySpendingKey.deriveSaskFromMnemonic(seedPhrase, getSaplingDerivationPath(hdIndex)),
          Shelter.saveAccountCredentials$(tezosCredentials, passwordHash),
          Shelter.saveAccountCredentials$(evmCredentials, passwordHash)
        ]).pipe(
          switchMap(([sask]) => Shelter.saveSaplingSpendingKey$(tezosCredentials.address, sask, passwordHash)),
          mapTo<Account>({
            id: nanoid(),
            type: AccountTypeEnum.HD,
            name,
            tezosAddress: tezosCredentials.address,
            tezosPublicKey: tezosCredentials.publicKey,
            evmAddress: evmCredentials.address,
            evmPublicKey: evmCredentials.publicKey,
            hdIndex
          })
        )
      )
    );

  static unlockApp$ = (password: string, currentAccountPkh: string, hdIndex: number | undefined) =>
    hashPassword$(password).pipe(
      switchMap(passwordHash =>
        Shelter.decryptSensitiveData$(PASSWORD_CHECK_KEY, passwordHash).pipe(
          switchMap(value =>
            value === null
              ? of(false)
              : !currentAccountPkh
              ? of(undefined).pipe(
                  tap(() => Shelter._passwordHash$.next(passwordHash)),
                  map(() => true)
                )
              : Shelter.revealSaplingSpendingKey$(currentAccountPkh, passwordHash).pipe(
                  switchMap(sask => {
                    if (sask) {
                      return of(sask);
                    }

                    return (
                      hdIndex === undefined
                        ? Shelter.restoreImportedAccountSaplingSpendingKey$(currentAccountPkh, passwordHash)
                        : Shelter.restoreHdAccountSaplingSpendingKey$(hdIndex, passwordHash)
                    ).pipe(catchError(() => of(undefined)));
                  }),
                  tap(() => Shelter._passwordHash$.next(passwordHash)),
                  map(() => true)
                )
          ),
          catchError(() => of(false))
        )
      )
    );

  static importHdAccount$ = (
    seedPhrase: string,
    password: string,
    hdAccountsLength = 1
  ): Observable<Account[] | undefined> => {
    if (!validateMnemonic(seedPhrase)) {
      return throwError$('Mnemonic not validated');
    }

    return hashPassword$(password).pipe(
      switchMap(passwordHash =>
        forkJoin([Promise.resolve(passwordHash), Shelter.setShelterVersion(Shelter.targetShelterVersion)])
      ),
      switchMap(([passwordHash]) => {
        Shelter._passwordHash$.next(passwordHash);

        return Shelter.saveSensitiveData$(
          {
            [PASSWORD_CHECK_KEY]: generateMnemonic(128)
          },
          passwordHash
        ).pipe(
          switchMap(() =>
            forkJoin(
              range(0, hdAccountsLength).map(hdAccountIndex =>
                Shelter.deriveAndSaveHdAccount$({
                  seedPhrase,
                  name: `Account ${hdAccountIndex + 1}`,
                  hdIndex: hdAccountIndex,
                  passwordHash
                })
              )
            )
          )
        );
      }),
      catchError(error => {
        console.error(error);

        return of(undefined);
      })
    );
  };

  static createImportedChainAccount$ = (
    privateKey: string,
    name: string,
    chain = TempleChainKind.Tezos
  ): Observable<Account> =>
    (chain === TempleChainKind.EVM
      ? from(Promise.resolve().then(() => privateKeyToEvmAccountCredentials(privateKey)))
      : from(privateKeyToTezosAccountCredentials(privateKey))
    ).pipe(
      switchMap(credentials => {
        if (chain === TempleChainKind.EVM) {
          return Shelter.saveAccountCredentials$(credentials).pipe(
            mapTo<Account>({
              id: nanoid(),
              name,
              type: AccountTypeEnum.IMPORTED_CHAIN,
              chain,
              address: credentials.address,
              publicKey: credentials.publicKey
            })
          );
        }

        return forkJoin([Shelter.saveAccountCredentials$(credentials)]).pipe(
          mapTo<Account>({
            id: nanoid(),
            name,
            type: AccountTypeEnum.IMPORTED_CHAIN,
            chain,
            address: credentials.address,
            publicKey: credentials.publicKey
          })
        );
      })
    );

  static createImportedMultichainAccount$ = ({
    seedPhrase,
    name,
    bip39Passphrase,
    chain = TempleChainKind.Tezos,
    derivationPath
  }: CreateImportedMultichainAccountOptions): Observable<ImportedMultichainAccount> => {
    if (!validateMnemonic(seedPhrase)) {
      return throwError$('Mnemonic not validated');
    }

    const tezosDerivationPath =
      chain === TempleChainKind.Tezos ? derivationPath ?? getTezosDerivationPath(0) : getTezosDerivationPath(0);
    const evmDerivationPath =
      chain === TempleChainKind.EVM ? derivationPath ?? getEvmDerivationPath(0) : getEvmDerivationPath(0);
    const saplingDerivationPath = getSaplingDerivationPath(
      chain === TempleChainKind.Tezos ? extractHdIndexFromDerivationPath(tezosDerivationPath) : undefined
    );

    return forkJoin([
      from(
        Promise.resolve().then(() => {
          const { chain: derivedChain, privateKey } = mnemonicToPrivateKey(
            seedPhrase,
            message => new Error(message),
            bip39Passphrase,
            tezosDerivationPath
          );

          if (derivedChain !== TempleChainKind.Tezos) {
            throw new Error('Invalid Tezos derivation path');
          }

          return privateKeyToTezosAccountCredentials(privateKey);
        })
      ),
      from(
        Promise.resolve().then(() => {
          const { chain: derivedChain, privateKey } = mnemonicToPrivateKey(
            seedPhrase,
            message => new Error(message),
            bip39Passphrase,
            evmDerivationPath
          );

          if (derivedChain !== TempleChainKind.EVM) {
            throw new Error('Invalid EVM derivation path');
          }

          return privateKeyToEvmAccountCredentials(privateKey);
        })
      )
    ]).pipe(
      switchMap(([tezosCredentials, evmCredentials]) =>
        forkJoin([
          InMemorySpendingKey.deriveSaskFromMnemonic(seedPhrase, saplingDerivationPath),
          Shelter.saveAccountCredentials$(tezosCredentials),
          Shelter.saveAccountCredentials$(evmCredentials)
        ]).pipe(
          switchMap(([saplingSpendingKey]) =>
            Shelter.saveSaplingSpendingKey$(tezosCredentials.address, saplingSpendingKey)
          ),
          mapTo<ImportedMultichainAccount>({
            id: nanoid(),
            name,
            type: AccountTypeEnum.IMPORTED_MULTICHAIN,
            tezosAddress: tezosCredentials.address,
            tezosPublicKey: tezosCredentials.publicKey,
            evmAddress: evmCredentials.address as HexString,
            evmPublicKey: evmCredentials.publicKey
          })
        )
      )
    );
  };

  static createHdAccount$ = (
    name: string,
    { accountIndex = 0, existingAccounts = [], explicitAccountIndex = false }: CreateHdAccountOptions = {}
  ): Observable<Account | undefined> =>
    Shelter.revealSeedPhrase$().pipe(
      switchMap(seedPhrase =>
        forkJoin([
          from(mnemonicToTezosAccountCredentials(seedPhrase, accountIndex)),
          from(Promise.resolve().then(() => mnemonicToEvmAccountCredentials(seedPhrase, accountIndex)))
        ]).pipe(
          switchMap(([tezosCredentials, evmCredentials]) => {
            const collisionAccounts = explicitAccountIndex
              ? existingAccounts
              : existingAccounts.filter(({ type }) => type !== AccountTypeEnum.HD);
            const hasCollision =
              hasSameChainAddress(collisionAccounts, TempleChainKind.Tezos, tezosCredentials.address) ||
              hasSameChainAddress(collisionAccounts, TempleChainKind.EVM, evmCredentials.address);

            if (hasCollision) {
              return explicitAccountIndex ? throwError$('Account already exists') : of(undefined);
            }

            return Shelter.deriveAndSaveHdAccount$({
              seedPhrase,
              name,
              hdIndex: accountIndex
            });
          }),
          catchError(error =>
            explicitAccountIndex ? throwError$(error instanceof Error ? error.message : String(error)) : of(undefined)
          )
        )
      )
    );

  static revealSecretKey$ = (address: string, passwordHash?: string) =>
    Shelter.decryptSensitiveData$(address, passwordHash ?? Shelter._passwordHash$.getValue()).pipe(
      switchMap(privateKeySeed => InMemorySigner.fromSecretKey(privateKeySeed)),
      switchMap(signer => signer.secretKey()),
      catchError(() => of(undefined))
    );

  static revealSeedPhrase$ = (passwordHash?: string) =>
    Shelter.decryptSensitiveData$('seedPhrase', passwordHash ?? Shelter._passwordHash$.getValue());

  private static getSaplingSkKey = (address: string) => `sapling_sk_${address}`;

  static saveSaplingSpendingKey$ = (address: string, sask: string, passwordHash?: string) =>
    Shelter.saveSensitiveData$({ [this.getSaplingSkKey(address)]: sask }, passwordHash);

  static revealSaplingSpendingKey$ = (address: string, passwordHash?: string) =>
    Shelter.decryptSensitiveData$(
      this.getSaplingSkKey(address),
      passwordHash ?? Shelter._passwordHash$.getValue()
    ).pipe(catchError(() => of(undefined)));

  static restoreHdAccountSaplingSpendingKey$ = (hdAccountIndex: number, passwordHash?: string) =>
    Shelter.revealSeedPhrase$(passwordHash).pipe(
      switchMap(seedPhrase => {
        const seed = mnemonicToSeedSync(seedPhrase);
        const privateKey = seedToPrivateKey(seed, getTezosDerivationPath(hdAccountIndex));

        return forkJoin([
          InMemorySpendingKey.deriveSaskFromMnemonic(seedPhrase, getSaplingDerivationPath(hdAccountIndex)),
          getPublicKeyAndHash$(privateKey)
        ] as const);
      }),
      switchMap(([sask, [, address]]) =>
        this.saveSaplingSpendingKey$(address, sask, passwordHash).pipe(map(() => sask))
      )
    );

  static restoreImportedAccountSaplingSpendingKey$ = (address: string, passwordHash?: string) =>
    Shelter.revealSecretKey$(address, passwordHash).pipe(
      switchMap(privateKey => {
        if (privateKey) {
          return from(deriveSaskFromPrivateKey(privateKey));
        }

        throw new Error('Failed to reveal private key');
      }),
      switchMap(sask => this.saveSaplingSpendingKey$(address, sask, passwordHash).pipe(map(() => sask)))
    );

  static getTezosSigner$ = (address: string) =>
    Shelter.revealSecretKey$(address).pipe(
      switchMap(value => (value === undefined ? throwError$('Failed to reveal private key') : of(value))),
      map(privateKey => new InMemorySigner(privateKey))
    );

  static enableBiometryPassword$ = (password: string) =>
    forkJoin([Shelter.getShelterVersion(), getSupportedBiometryType()]).pipe(
      switchMap(([shelterVersion, supportedBiometryType]) =>
        isDefined(supportedBiometryType)
          ? setGenericPassword(PASSWORD_STORAGE_KEY, JSON.stringify(password), {
              ...getBiometryKeychainOptions(shelterVersion),
              authenticationPrompt: {
                title: 'Authenticate to enable biometry',
                cancel: 'Cancel'
              }
            })
          : of(false)
      ),
      catchError(() => of(false))
    );

  static disableBiometryPassword$ = () =>
    Shelter.getShelterVersion$().pipe(
      switchMap(shelterVersion => from(resetGenericPassword(getKeychainOptions(PASSWORD_STORAGE_KEY, shelterVersion))))
    );

  static getBiometryPassword = async () =>
    Shelter.getShelterVersion().then(shelterVersion => getGenericPassword(getBiometryKeychainOptions(shelterVersion)));

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
