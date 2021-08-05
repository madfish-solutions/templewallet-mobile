import { AccountTypeEnum } from '../enums/account-type.enum';

export interface AccountInterface {
  name: string;
  publicKey: string;
  type: AccountTypeEnum;
  publicKeyHash: string;
}

export const initialAccount: AccountInterface = {
  name: '',
  publicKey: '',
  type: AccountTypeEnum.HD_ACCOUNT,
  publicKeyHash: 'empty_public_key_hash'
};

export const emptyAccount: AccountInterface = {
  name: '',
  publicKey: '',
  type: AccountTypeEnum.HD_ACCOUNT,
  publicKeyHash: 'empty_public_key_hash'
};
