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
  publicKeyHash: 'empty_public_key_hash'
};

export const emptyAccount: AccountInterface = {
  name: '',
  type: AccountTypeEnum.HD_ACCOUNT,
  publicKey: '',
  publicKeyHash: 'empty_public_key_hash'
};
