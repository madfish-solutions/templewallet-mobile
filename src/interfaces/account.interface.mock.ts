import { AccountTypeEnum } from '../enums/account-type.enum';
import { TempleChainKind } from '../enums/temple-chain-kind.enum';
import { mockAccountCredentials } from '../mocks/account-credentials.mock';

import { HDAccount, ImportedChainAccount } from './account.interfaces';
import { Contact } from './contact.interface';

export const mockContact: Contact = {
  name: 'MockContact',
  address: mockAccountCredentials.publicKeyHash
};

export const mockHdAccount: HDAccount = {
  id: mockAccountCredentials.publicKeyHash,
  name: 'Mock HD Account',
  type: AccountTypeEnum.HD,
  tezosAddress: mockAccountCredentials.publicKeyHash,
  tezosPublicKey: mockAccountCredentials.publicKey,
  evmAddress: '0xfDc237eff648793c9F3B976c702493f0EE056489',
  evmPublicKey: 'f648793c9F3B976c702493f0EE05648976c702493f76c702493f76c702493f76c702493f',
  hdIndex: 0
};

export const mockNewHdAccount: HDAccount = {
  id: 'tz1NewMockPublicKeyHash',
  name: 'Mock New HD Account',
  type: AccountTypeEnum.HD,
  tezosAddress: 'tz1NewMockPublicKeyHash',
  tezosPublicKey: 'tz2NewMockPublicKey',
  evmAddress: '0x1111111111111111111111111111111111111111',
  evmPublicKey: '1111111111111111111111111111111111111111111111111111111111111111111111111',
  hdIndex: 1
};

export const mockTezosImportedAccount: ImportedChainAccount = {
  id: 'tz1ImportedMockPublicKeyHash',
  name: 'Mock Tezos Imported Account',
  type: AccountTypeEnum.IMPORTED_CHAIN,
  chain: TempleChainKind.Tezos,
  address: 'tz1ImportedMockPublicKeyHash',
  publicKey: 'tz2NewMockPublicKey'
};

export const mockEvmImportedAccount: ImportedChainAccount = {
  id: '0x2222222222222222222222222222222222222222',
  name: 'Mock EVM Imported Account',
  type: AccountTypeEnum.IMPORTED_CHAIN,
  chain: TempleChainKind.EVM,
  address: '0x2222222222222222222222222222222222222222',
  publicKey: '0x33333333333333333333333333333333333333'
};
