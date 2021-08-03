export enum AccountTypeEnum {
  HD_ACCOUNT = 'HD_ACCOUNT',
  IMPORTED_ACCOUNT = 'IMPORTED_ACCOUNT'
}

export interface AccountInterface {
  name: string;
  publicKey: string;
  type: AccountTypeEnum | string;
  publicKeyHash: string;
}

export const initialAccount: AccountInterface = {
  name: '',
  publicKey: '',
  type: '',
  publicKeyHash: 'empty_public_key_hash'
};

export const emptyAccount: AccountInterface = {
  name: '',
  publicKey: '',
  type: '',
  publicKeyHash: 'empty_public_key_hash'
};
