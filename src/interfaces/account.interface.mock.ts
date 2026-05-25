import { AccountTypeEnum } from '../enums/account-type.enum';
import { TempleChainKind } from '../enums/temple-chain-kind.enum';
import { mockAccountCredentials } from '../mocks/account-credentials.mock';

import { AccountInterface, AccountBaseInterface } from './account.interface';

export const mockAccountBase: AccountBaseInterface = {
  name: 'MockContact',
  publicKeyHash: mockAccountCredentials.publicKeyHash
};

export const mockHdAccount: AccountInterface = {
  id: mockAccountCredentials.publicKeyHash,
  name: 'Mock HD Account',
  type: AccountTypeEnum.HD_ACCOUNT,
  publicKey: mockAccountCredentials.publicKey,
  publicKeyHash: mockAccountCredentials.publicKeyHash,
  tezosAddress: mockAccountCredentials.publicKeyHash,
  evmAddress: '0xfDc237eff648793c9F3B976c702493f0EE056489',
  walletId: 'mock-wallet',
  hdIndex: 0
};

export const mockNewHdAccount: AccountInterface = {
  id: 'tz1NewMockPublicKeyHash',
  name: 'Mock New HD Account',
  type: AccountTypeEnum.HD_ACCOUNT,
  publicKey: 'edpkNewMockPublicKey',
  publicKeyHash: 'tz1NewMockPublicKeyHash',
  tezosAddress: 'tz1NewMockPublicKeyHash',
  evmAddress: '0x1111111111111111111111111111111111111111',
  walletId: 'mock-wallet',
  hdIndex: 1
};

export const mockTezosImportedAccount: AccountInterface = {
  id: 'tz1ImportedMockPublicKeyHash',
  name: 'Mock Tezos Imported Account',
  type: AccountTypeEnum.IMPORTED_ACCOUNT,
  publicKey: 'edpkImportedMockPublicKey',
  publicKeyHash: 'tz1ImportedMockPublicKeyHash',
  chain: TempleChainKind.Tezos,
  address: 'tz1ImportedMockPublicKeyHash'
};

export const mockEvmImportedAccount: AccountInterface = {
  id: '0x2222222222222222222222222222222222222222',
  name: 'Mock EVM Imported Account',
  type: AccountTypeEnum.IMPORTED_ACCOUNT,
  publicKey: '',
  publicKeyHash: '',
  chain: TempleChainKind.EVM,
  address: '0x2222222222222222222222222222222222222222'
};
