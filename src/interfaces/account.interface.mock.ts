import { AccountTypeEnum } from '../enums/account-type.enum';
import { mockAccountCredentials } from '../mocks/account-credentials.mock';
import { AccountInterface } from './account.interface';

export const mockHdAccount: AccountInterface = {
  name: 'Mock HD Account',
  type: AccountTypeEnum.HD_ACCOUNT,
  publicKey: mockAccountCredentials.publicKey,
  publicKeyHash: mockAccountCredentials.publicKeyHash
};
