import { EMPTY_PUBLIC_KEY_HASH } from '../config/system';
import { AccountTypeEnum } from '../enums/account-type.enum';
import { LoadableEntityState } from '../store/types';
import { AccountTokenInterface } from '../token/interfaces/account-token.interface';

import { ActivityGroup } from './activity.interface';

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
  /** @deprecated */
  activityGroups?: LoadableEntityState<ActivityGroup[]>;
  /** @deprecated */
  pendingActivities?: ActivityGroup[];
}

/** @deprecated // BAD PRACTICE */
export const initialAccount: AccountInterface = {
  name: '',
  type: AccountTypeEnum.HD_ACCOUNT,
  publicKey: '',
  publicKeyHash: EMPTY_PUBLIC_KEY_HASH
};

/** @deprecated // BAD PRACTICE */
export const emptyAccount: AccountInterface = {
  name: '',
  type: AccountTypeEnum.HD_ACCOUNT,
  publicKey: '',
  publicKeyHash: EMPTY_PUBLIC_KEY_HASH
};

/** @deprecated // BAD PRACTICE */
export const emptyAccountBase: AccountBaseInterface = {
  name: '',
  publicKeyHash: EMPTY_PUBLIC_KEY_HASH
};
