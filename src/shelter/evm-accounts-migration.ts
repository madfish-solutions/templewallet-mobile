import { firstValueFrom } from 'rxjs';

import { EVM_ADDRESS_PLACEHOLDER } from 'src/config/wallet.const';
import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { Account } from 'src/interfaces/account.interfaces';
import { completeEvmAccountsMigrationAction } from 'src/store/wallet/wallet-actions';
import { WalletState } from 'src/store/wallet/wallet-state';
import { mnemonicToEvmAccountCredentials } from 'src/utils/keys.utils';

import { Shelter } from './shelter';

interface EvmAccountsMigrationParams {
  wallet: WalletState;
  dispatch: (action: ReturnType<typeof completeEvmAccountsMigrationAction>) => void;
}

export const runEvmAccountsMigration = async ({ wallet, dispatch }: EvmAccountsMigrationParams) => {
  if (!walletNeedsMigration(wallet)) {
    return;
  }

  const mnemonic = await firstValueFrom(Shelter.revealSeedPhrase$());
  let hdPosition = 0;

  const migratedAccounts: Account[] = [];

  for (const account of wallet.accounts) {
    if (account.type !== AccountTypeEnum.HD) {
      migratedAccounts.push(account);
      continue;
    }

    const hdIndex = hdPosition;
    hdPosition++;

    const evmCredentials = mnemonicToEvmAccountCredentials(mnemonic, hdIndex);

    await firstValueFrom(Shelter.saveAccountCredentials$(evmCredentials));

    migratedAccounts.push({
      ...account,
      evmAddress: evmCredentials.address,
      evmPublicKey: evmCredentials.publicKey
    });
  }

  dispatch(completeEvmAccountsMigrationAction(migratedAccounts));
};

const accountNeedsMigration = (account: Account) =>
  account.type === AccountTypeEnum.HD && account.evmAddress === EVM_ADDRESS_PLACEHOLDER;

export const walletNeedsMigration = (wallet: WalletState) =>
  wallet.accounts.some(account => accountNeedsMigration(account));
