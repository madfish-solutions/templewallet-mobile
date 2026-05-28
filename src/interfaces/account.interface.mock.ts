import { AccountTypeEnum } from '../enums/account-type.enum';
import { TempleChainKind } from '../enums/temple-chain-kind.enum';
import { mockAccountCredentials } from '../mocks/account-credentials.mock';

import { HDAccount, ImportedAccount } from './account.interfaces';
import { Contact } from './contact.interface';

export const mockContact: Contact = {
  name: 'MockContact',
  address: mockAccountCredentials.publicKeyHash
};

export const mockHdAccount: HDAccount = {
  id: mockAccountCredentials.publicKeyHash,
  name: 'Mock HD Account',
  type: AccountTypeEnum.HD_ACCOUNT,
  tezosAddress: mockAccountCredentials.publicKeyHash,
  evmAddress: '0xfDc237eff648793c9F3B976c702493f0EE056489',
  hdIndex: 0
};

export const mockNewHdAccount: HDAccount = {
  id: 'tz1NewMockPublicKeyHash',
  name: 'Mock New HD Account',
  type: AccountTypeEnum.HD_ACCOUNT,
  tezosAddress: 'tz1NewMockPublicKeyHash',
  evmAddress: '0x1111111111111111111111111111111111111111',
  hdIndex: 1
};

export const mockTezosImportedAccount: ImportedAccount = {
  id: 'tz1ImportedMockPublicKeyHash',
  name: 'Mock Tezos Imported Account',
  type: AccountTypeEnum.IMPORTED_ACCOUNT,
  chain: TempleChainKind.Tezos,
  address: 'tz1ImportedMockPublicKeyHash'
};

export const mockEvmImportedAccount: ImportedAccount = {
  id: '0x2222222222222222222222222222222222222222',
  name: 'Mock EVM Imported Account',
  type: AccountTypeEnum.IMPORTED_ACCOUNT,
  chain: TempleChainKind.EVM,
  address: '0x2222222222222222222222222222222222222222'
};
