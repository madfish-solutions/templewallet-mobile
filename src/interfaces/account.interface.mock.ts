import { AccountTypeEnum } from '../enums/account-type.enum';
import { mockAccountCredentials } from '../mocks/account-credentials.mock';

import { AccountInterface, AccountBaseInterface } from './account.interface';

export const mockAccountBase: AccountBaseInterface = {
  name: 'MockContact',
  publicKeyHash: mockAccountCredentials.publicKeyHash
};

export const mockHdAccount: AccountInterface = {
  name: 'Mock HD Account',
  type: AccountTypeEnum.HD_ACCOUNT,
  publicKey: mockAccountCredentials.publicKey,
  publicKeyHash: mockAccountCredentials.publicKeyHash
};

export const mockNewHdAccount: AccountInterface = {
  name: 'Mock New HD Account',
  type: AccountTypeEnum.HD_ACCOUNT,
  publicKey: 'edpkNewMockPublicKey',
  publicKeyHash: 'tz1NewMockPublicKeyHash'
};
