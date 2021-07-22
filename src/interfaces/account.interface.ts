export interface AccountInterface {
  name: string;
  publicKey: string;
  publicKeyHash: string;
}

export const initialAccount: AccountInterface = {
  name: '',
  publicKey: '',
  publicKeyHash: 'empty_public_key_hash'
};

export const emptyAccount: AccountInterface = {
  name: '',
  publicKey: '',
  publicKeyHash: 'empty_public_key_hash'
};
