import { firstValueFrom } from 'rxjs';

import { DEFAULT_HD_WALLET_ID, EVM_ADDRESS_PLACEHOLDER } from 'src/config/wallet.const';
import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { Account } from 'src/interfaces/account.interfaces';
import { completeEvmAccountsMigrationAction } from 'src/store/wallet/wallet-actions';
import { WalletState } from 'src/store/wallet/wallet-state';
import {
  mnemonicToEvmAccountCreds,
  mnemonicToTezosAccountCreds,
  privateKeyToTezosAccountCreds
} from 'src/utils/keys.utils';
import { getSaplingDerivationPath } from 'src/utils/sapling/address-utils';
import { InMemorySpendingKey } from 'src/utils/sapling/sapling-keys';

import { Shelter } from './shelter';

interface EvmAccountsMigrationParams {
  wallet: WalletState;
  dispatch: (action: ReturnType<typeof completeEvmAccountsMigrationAction>) => void;
}

export const runEvmAccountsMigration = async ({ wallet, dispatch }: EvmAccountsMigrationParams) => {
  if (!walletNeedsMigration(wallet)) {
    return;
  }

  const mnemonic = await firstValueFrom(Shelter.revealWalletMnemonic$(DEFAULT_HD_WALLET_ID));
  let hdPosition = 0;

  const migratedAccounts: Account[] = [];

  for (const account of wallet.accounts) {
    if (account.type !== AccountTypeEnum.HD_ACCOUNT) {
      continue;
    }

    const hdIndex = hdPosition;
    hdPosition++;

    await saveTezosAccountCredsIfPossible(mnemonic, hdIndex, account.tezosAddress);
    const evmCreds = mnemonicToEvmAccountCreds(mnemonic, hdIndex);

    await firstValueFrom(Shelter.saveAccountCreds$(evmCreds));
    await restoreSaplingSpendingKeyIfMissing(mnemonic, hdIndex, account.tezosAddress);

    migratedAccounts.push({
      ...account,
      evmAddress: evmCreds.address as HexString
    });
  }

  if (mnemonic) {
    await firstValueFrom(Shelter.saveWalletMnemonic$(DEFAULT_HD_WALLET_ID, mnemonic));
  }

  dispatch(completeEvmAccountsMigrationAction(migratedAccounts));
};

export const getEvmAccountsMigrationErrorMessage = (error: unknown) => {
  if (error instanceof Error && /No record in Keychain.*seedPhrase|Seed phrase is required/.test(error.message)) {
    return 'We could not read your seed phrase from secure storage. Lock the app, unlock again, and retry the update.';
  }

  return 'Unable to update wallet accounts. Please try again.';
};

export const accountNeedsMigration = (account: Account) => {
  if (account.type === AccountTypeEnum.HD_ACCOUNT) {
    return account.evmAddress === EVM_ADDRESS_PLACEHOLDER;
  }

  if (account.type === AccountTypeEnum.IMPORTED_ACCOUNT) {
    return account.chain === TempleChainKind.EVM && account.address === EVM_ADDRESS_PLACEHOLDER;
  }

  return false;
};

export const walletNeedsMigration = (wallet: WalletState) =>
  wallet.accounts.some(account => accountNeedsMigration(account));

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
