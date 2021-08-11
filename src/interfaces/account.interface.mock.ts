import { AccountTypeEnum } from '../enums/account-type.enum';
import { AccountInterface } from './account.interface';

export const mockHdAccount: AccountInterface = {
  name: 'Mock HD Account',
  publicKey: 'mockHdAccountPublicKey',
  type: AccountTypeEnum.HD_ACCOUNT,
  publicKeyHash: 'mockHdAccountPublicKeyHash'
};
