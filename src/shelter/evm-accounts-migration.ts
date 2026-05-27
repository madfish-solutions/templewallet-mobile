import AsyncStorage from '@react-native-async-storage/async-storage';
import { nanoid } from '@reduxjs/toolkit';
import { firstValueFrom } from 'rxjs';

import { DEFAULT_HD_WALLET_ID, DEFAULT_HD_WALLET_NAME } from 'src/config/wallet.const';
import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { AccountInterface } from 'src/interfaces/account.interface';
import { WalletSpecsInterface } from 'src/interfaces/wallet-specs.interface';
import { completeEvmAccountsMigrationAction } from 'src/store/wallet/wallet-actions';
import { WalletState } from 'src/store/wallet/wallet-state';
import { getAccountAddressForTezos, getAccountId } from 'src/utils/account.utils';
import {
  mnemonicToEvmAccountCreds,
  mnemonicToTezosAccountCreds,
  privateKeyToTezosAccountCreds
} from 'src/utils/keys.utils';
import { getSaplingDerivationPath } from 'src/utils/sapling/address-utils';
import { InMemorySpendingKey } from 'src/utils/sapling/sapling-keys';

import { Shelter } from './shelter';

export const EVM_ACCOUNTS_MIGRATION_VERSION_KEY = 'evmAccountsMigrationVersion';
export const TARGET_EVM_ACCOUNTS_MIGRATION_VERSION = 1;

interface EvmAccountsMigrationParams {
  wallet: WalletState;
  dispatch: (action: ReturnType<typeof completeEvmAccountsMigrationAction>) => void;
  flushPersistor: EmptyFn | (() => Promise<unknown>);
}

interface EvmAccountsMigrationResult {
  didRun: boolean;
  accounts: AccountInterface[];
}

const getStoredMigrationVersion = async () => {
  const rawVersion = await AsyncStorage.getItem(EVM_ACCOUNTS_MIGRATION_VERSION_KEY);

  return rawVersion ? Number(rawVersion) : 0;
};

export const isEvmAccountsMigrationComplete = async () =>
  (await getStoredMigrationVersion()) >= TARGET_EVM_ACCOUNTS_MIGRATION_VERSION;

export const accountNeedsEvmRuntimeMigration = (account: AccountInterface) => {
  if (!account.id) {
    return true;
  }

  if (account.type === AccountTypeEnum.HD_ACCOUNT) {
    return !account.walletId || account.hdIndex === undefined || !account.tezosAddress || !account.evmAddress;
  }

  if (account.type === AccountTypeEnum.IMPORTED_ACCOUNT) {
    return !account.chain || !account.address;
  }

  return false;
};

export const walletNeedsEvmAccountsMigration = (wallet: WalletState) =>
  wallet.accounts.some(accountNeedsEvmRuntimeMigration);

const getWalletId = (accounts: AccountInterface[], walletsSpecsRecord: Record<string, WalletSpecsInterface>) => {
  const hdAccountWalletId = accounts.find(
    ({ type, walletId }) => type === AccountTypeEnum.HD_ACCOUNT && walletId
  )?.walletId;
  const walletSpecsId = Object.keys(walletsSpecsRecord)[0];

  return hdAccountWalletId ?? walletSpecsId ?? DEFAULT_HD_WALLET_ID;
};

const getSelectedAccountId = (wallet: WalletState, accounts: AccountInterface[]) => {
  const selectedAccount =
    accounts.find(account => getAccountId(account) === wallet.selectedAccountId) ??
    accounts.find(account => getAccountAddressForTezos(account) === wallet.selectedAccountPublicKeyHash) ??
    accounts.find(({ type }) => type === AccountTypeEnum.HD_ACCOUNT) ??
    accounts[0];

  return selectedAccount ? getAccountId(selectedAccount) : '';
};

const normalizeImportedAccount = (account: AccountInterface): AccountInterface => {
  const address = account.address ?? account.publicKeyHash;

  return {
    ...account,
    id: account.id || address || nanoid(),
    chain: account.chain ?? TempleChainKind.Tezos,
    address
  };
};

const saveTezosAccountCredsIfPossible = async (mnemonic: string, hdIndex: number, tezosAddress: string) => {
  const derivedCreds = await mnemonicToTezosAccountCreds(mnemonic, hdIndex);

  if (derivedCreds.address === tezosAddress) {
    await firstValueFrom(Shelter.saveAccountCreds$(derivedCreds));

    return derivedCreds;
  }

  const legacyPrivateKey = await firstValueFrom(Shelter.revealSecretKey$(tezosAddress));

  if (legacyPrivateKey) {
    const legacyCreds = await privateKeyToTezosAccountCreds(legacyPrivateKey);
    await firstValueFrom(Shelter.saveAccountCreds$(legacyCreds));

    return legacyCreds;
  }

  console.warn(
    `[EVM account migration] Could not backfill Tezos address-keyed storage for ${tezosAddress} at HD index ${hdIndex}`
  );

  return derivedCreds;
};

const restoreSaplingSpendingKeyIfMissing = async (mnemonic: string, hdIndex: number, tezosAddress: string) => {
  const existingSpendingKey = await firstValueFrom(Shelter.revealSaplingSpendingKey$(tezosAddress));

  if (existingSpendingKey) {
    return;
  }

  const sask = await InMemorySpendingKey.deriveSaskFromMnemonic(mnemonic, getSaplingDerivationPath(hdIndex));
  await firstValueFrom(Shelter.saveSaplingSpendingKey$(tezosAddress, sask));
};

export const runEvmAccountsMigration = async ({
  wallet,
  dispatch,
  flushPersistor
}: EvmAccountsMigrationParams): Promise<EvmAccountsMigrationResult> => {
  const markerVersion = await getStoredMigrationVersion();
  const needsPublicDataMigration = walletNeedsEvmAccountsMigration(wallet);

  if (markerVersion >= TARGET_EVM_ACCOUNTS_MIGRATION_VERSION && !needsPublicDataMigration) {
    return { didRun: false, accounts: wallet.accounts };
  }

  const startedAt = Date.now();
  const walletId = getWalletId(wallet.accounts, wallet.walletsSpecsRecord);
  const walletsSpecsRecord = { ...wallet.walletsSpecsRecord };
  const hasHdAccounts = wallet.accounts.some(({ type }) => type === AccountTypeEnum.HD_ACCOUNT);

  if (hasHdAccounts && !walletsSpecsRecord[walletId]) {
    walletsSpecsRecord[walletId] = {
      id: walletId,
      name: DEFAULT_HD_WALLET_NAME,
      createdAt: Date.now()
    };
  }

  const mnemonic = hasHdAccounts ? await firstValueFrom(Shelter.revealWalletMnemonic$(walletId)) : undefined;
  let hdPosition = 0;

  const migratedAccounts: AccountInterface[] = [];

  for (const account of wallet.accounts) {
    if (account.type !== AccountTypeEnum.HD_ACCOUNT) {
      migratedAccounts.push(
        account.type === AccountTypeEnum.IMPORTED_ACCOUNT ? normalizeImportedAccount(account) : account
      );

      continue;
    }

    if (!mnemonic) {
      throw new Error('Seed phrase is required to migrate HD accounts');
    }

    const hdIndex = account.hdIndex ?? hdPosition;
    hdPosition++;

    const tezosAddress = account.tezosAddress ?? account.publicKeyHash;
    const tezosCreds = await saveTezosAccountCredsIfPossible(mnemonic, hdIndex, tezosAddress);
    const evmCreds = mnemonicToEvmAccountCreds(mnemonic, hdIndex);

    await firstValueFrom(Shelter.saveAccountCreds$(evmCreds));
    await restoreSaplingSpendingKeyIfMissing(mnemonic, hdIndex, tezosAddress);

    migratedAccounts.push({
      ...account,
      id: account.id || tezosAddress || nanoid(),
      walletId,
      hdIndex,
      tezosAddress,
      evmAddress: evmCreds.address,
      publicKey: account.publicKey || tezosCreds.publicKey,
      publicKeyHash: account.publicKeyHash || tezosAddress
    });
  }

  if (mnemonic) {
    await firstValueFrom(Shelter.saveWalletMnemonic$(walletId, mnemonic));
  }

  console.info(`[EVM account migration] Keychain writes completed in ${Date.now() - startedAt}ms`);

  const selectedAccountId = getSelectedAccountId(wallet, migratedAccounts);

  dispatch(
    completeEvmAccountsMigrationAction({
      accounts: migratedAccounts,
      walletsSpecsRecord,
      selectedAccountId
    })
  );

  await flushPersistor();
  console.info(`[EVM account migration] Redux persistence completed in ${Date.now() - startedAt}ms`);

  await AsyncStorage.setItem(EVM_ACCOUNTS_MIGRATION_VERSION_KEY, String(TARGET_EVM_ACCOUNTS_MIGRATION_VERSION));

  return { didRun: true, accounts: migratedAccounts };
};

export const getEvmAccountsMigrationErrorMessage = (error: unknown) => {
  if (error instanceof Error && /No record in Keychain.*seedPhrase|Seed phrase is required/.test(error.message)) {
    return 'We could not read your seed phrase from secure storage. Lock the app, unlock again, and retry the update.';
  }

  return 'Unable to update wallet accounts. Please try again.';
};
