import { EMPTY_PUBLIC_KEY_HASH } from '../config/system';
import { AccountTypeEnum } from '../enums/account-type.enum';

export interface AccountInterface {
  name: string;
  type: AccountTypeEnum;
  publicKey: string;
  publicKeyHash: string;
}

export const initialAccount: AccountInterface = {
  name: '',
  type: AccountTypeEnum.HD_ACCOUNT,
  publicKey: '',
  publicKeyHash: EMPTY_PUBLIC_KEY_HASH
};

export const emptyAccount: AccountInterface = {
  name: '',
  type: AccountTypeEnum.HD_ACCOUNT,
  publicKey: '',
  publicKeyHash: EMPTY_PUBLIC_KEY_HASH
};
