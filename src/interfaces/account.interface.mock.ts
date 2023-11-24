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
