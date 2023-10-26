import { EMPTY_PUBLIC_KEY_HASH } from '../config/system';
import { AccountTypeEnum } from '../enums/account-type.enum';
import { AccountTokenInterface } from '../token/interfaces/account-token.interface';

export interface AccountBaseInterface {
  name: string;
  publicKeyHash: string;
}

export interface AccountInterface extends AccountBaseInterface {
  type: AccountTypeEnum;
  publicKey: string;

  /** @deprecated */
  isVisible?: boolean;
  /** @deprecated */
  tezosBalance?: string;
  /** @deprecated */
  tokensList?: AccountTokenInterface[];
  /** @deprecated */
  removedTokensList?: string[];
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

export const emptyAccountBase: AccountBaseInterface = {
  name: '',
  publicKeyHash: EMPTY_PUBLIC_KEY_HASH
};
