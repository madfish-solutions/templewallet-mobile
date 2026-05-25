import type { PersistedState } from 'redux-persist';

import { DEFAULT_HD_WALLET_ID, DEFAULT_HD_WALLET_NAME } from 'src/config/wallet.const';
import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';

import { MIGRATIONS } from './migrations';

interface TestMigratedState {
  wallet: {
    accounts: unknown[];
    accountsStateRecord: unknown;
    selectedAccountId: string;
    walletsSpecsRecord: Record<string, unknown>;
  };
  sapling: {
    accountsRecord: unknown;
  };
}

describe('root persist migration 9', () => {
  it('normalizes legacy account public fields without moving Tezos-keyed records', () => {
    const hdAccount = {
      name: 'Account 1',
      type: AccountTypeEnum.HD_ACCOUNT,
      publicKey: 'edpk1',
      publicKeyHash: 'tz1Hd'
    };
    const secondHdAccount = {
      name: 'Account 2',
      type: AccountTypeEnum.HD_ACCOUNT,
      publicKey: 'edpk2',
      publicKeyHash: 'tz1Hd2'
    };
    const importedAccount = {
      name: 'Imported',
      type: AccountTypeEnum.IMPORTED_ACCOUNT,
      publicKey: 'edpk3',
      publicKeyHash: 'tz1Imported'
    };
    const accountsStateRecord = { tz1Hd: { tezosBalance: '1' } };
    const saplingAccountsRecord = { tz1Hd: { shieldedBalance: '2' } };
    const state = {
      wallet: {
        accounts: [hdAccount, secondHdAccount, importedAccount],
        accountsStateRecord,
        selectedAccountPublicKeyHash: 'tz1Hd2',
        selectedAccountId: '',
        walletsSpecsRecord: {}
      },
      sapling: {
        accountsRecord: saplingAccountsRecord
      }
    };

    const migratedState = MIGRATIONS[9](state as unknown as PersistedState) as unknown as TestMigratedState;

    expect(migratedState.wallet.accounts).toEqual([
      {
        ...hdAccount,
        id: 'tz1Hd',
        walletId: DEFAULT_HD_WALLET_ID,
        hdIndex: 0,
        tezosAddress: 'tz1Hd'
      },
      {
        ...secondHdAccount,
        id: 'tz1Hd2',
        walletId: DEFAULT_HD_WALLET_ID,
        hdIndex: 1,
        tezosAddress: 'tz1Hd2'
      },
      {
        ...importedAccount,
        id: 'tz1Imported',
        chain: TempleChainKind.Tezos,
        address: 'tz1Imported'
      }
    ]);
    expect(migratedState.wallet.selectedAccountId).toBe('tz1Hd2');
    expect(migratedState.wallet.accountsStateRecord).toBe(accountsStateRecord);
    expect(migratedState.sapling.accountsRecord).toBe(saplingAccountsRecord);
    expect(migratedState.wallet.walletsSpecsRecord[DEFAULT_HD_WALLET_ID]).toMatchObject({
      id: DEFAULT_HD_WALLET_ID,
      name: DEFAULT_HD_WALLET_NAME
    });
  });
});
