import AsyncStorage from '@react-native-async-storage/async-storage';

import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { Account } from 'src/interfaces/account.interfaces';
import { mockAccountCredentials } from 'src/mocks/account-credentials.mock';
import { mockKeychain } from 'src/mocks/react-native-keychain.mock';
import { mockEncryptedData, mockCryptoUtil } from 'src/utils/crypto.util.mock';
import { getKeychainOptions } from 'src/utils/keychain.utils';

import {
  EVM_ACCOUNTS_MIGRATION_VERSION_KEY,
  runEvmAccountsMigration,
  TARGET_EVM_ACCOUNTS_MIGRATION_VERSION
} from './evm-accounts-migration';

const mockEvmAddress = '0xfDc237eff648793c9F3B976c702493f0EE056489';

const legacyHdAccount = {
  name: 'Account 1',
  type: AccountTypeEnum.HD_ACCOUNT,
  publicKey: mockAccountCredentials.publicKey,
  publicKeyHash: mockAccountCredentials.publicKeyHash
} as unknown as Account;

const legacyImportedAccount = {
  name: 'Imported',
  type: AccountTypeEnum.IMPORTED_ACCOUNT,
  publicKey: mockAccountCredentials.publicKey,
  publicKeyHash: mockAccountCredentials.publicKeyHash
} as unknown as Account;

const createWalletState = (accounts: Account[]) => ({
  accounts,
  accountsStateRecord: {
    [mockAccountCredentials.publicKeyHash]: {
      isVisible: true,
      tezosBalance: '0',
      tokensList: [],
      dcpTokensList: [],
      removedTokensList: []
    }
  },
  selectedAccountId: '',
  selectedAccountPublicKeyHash: mockAccountCredentials.publicKeyHash,
  walletsSpecsRecord: {}
});

describe('runEvmAccountsMigration', () => {
  let consoleInfoSpy: jest.SpyInstance;

  beforeEach(async () => {
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    jest.clearAllMocks();
    await AsyncStorage.clear();
    mockCryptoUtil.decryptString$.mockResolvedValue(mockAccountCredentials.seedPhrase);
  });

  afterEach(() => {
    consoleInfoSpy.mockRestore();
  });

  it('migrates a legacy HD account, preserves selected Tezos address, and writes the marker after flush', async () => {
    const dispatch = jest.fn();
    const flushPersistor = jest.fn().mockResolvedValue(undefined);

    await runEvmAccountsMigration({
      wallet: createWalletState([legacyHdAccount]),
      dispatch,
      flushPersistor
    });

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch.mock.calls[0][0].payload).toMatchObject({
      selectedAccountId: mockAccountCredentials.publicKeyHash
    });
    expect(dispatch.mock.calls[0][0].payload.accounts[0]).toMatchObject({
      id: mockAccountCredentials.publicKeyHash,
      name: 'Account 1',
      type: AccountTypeEnum.HD_ACCOUNT,
      hdIndex: 0,
      tezosAddress: mockAccountCredentials.publicKeyHash,
      evmAddress: mockEvmAddress
    });
    expect(mockKeychain.setGenericPassword).toHaveBeenCalledWith(
      `account_private_key_${mockEvmAddress}`,
      JSON.stringify(mockEncryptedData),
      getKeychainOptions(`account_private_key_${mockEvmAddress}`, 0)
    );
    expect(flushPersistor).toHaveBeenCalledTimes(1);
    await expect(AsyncStorage.getItem(EVM_ACCOUNTS_MIGRATION_VERSION_KEY)).resolves.toBe(
      String(TARGET_EVM_ACCOUNTS_MIGRATION_VERSION)
    );
  });

  it('normalizes legacy imported accounts as Tezos-only accounts without EVM addresses', async () => {
    const dispatch = jest.fn();

    await runEvmAccountsMigration({
      wallet: createWalletState([legacyImportedAccount]),
      dispatch,
      flushPersistor: jest.fn().mockResolvedValue(undefined)
    });

    expect(dispatch.mock.calls[0][0].payload.accounts[0]).toMatchObject({
      id: mockAccountCredentials.publicKeyHash,
      type: AccountTypeEnum.IMPORTED_ACCOUNT,
      chain: TempleChainKind.Tezos,
      address: mockAccountCredentials.publicKeyHash
    });
    expect(dispatch.mock.calls[0][0].payload.accounts[0].evmAddress).toBeUndefined();
  });

  it('does not write the migration marker when persistence flush fails', async () => {
    await expect(
      runEvmAccountsMigration({
        wallet: createWalletState([legacyHdAccount]),
        dispatch: jest.fn(),
        flushPersistor: jest.fn().mockRejectedValue(new Error('flush failed'))
      })
    ).rejects.toThrow('flush failed');

    await expect(AsyncStorage.getItem(EVM_ACCOUNTS_MIGRATION_VERSION_KEY)).resolves.toBeNull();
  });

  it('does not dispatch or write the migration marker when EVM key storage fails', async () => {
    mockKeychain.setGenericPassword.mockImplementation((service: string) =>
      Promise.resolve(service === `account_private_key_${mockEvmAddress}` ? false : undefined)
    );

    const dispatch = jest.fn();

    await expect(
      runEvmAccountsMigration({
        wallet: createWalletState([legacyHdAccount]),
        dispatch,
        flushPersistor: jest.fn().mockResolvedValue(undefined)
      })
    ).rejects.toThrow('Failed to save sensitive data');

    expect(dispatch).not.toHaveBeenCalled();
    await expect(AsyncStorage.getItem(EVM_ACCOUNTS_MIGRATION_VERSION_KEY)).resolves.toBeNull();
  });
});
