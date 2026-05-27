import { EMPTY_PUBLIC_KEY_HASH } from '../config/system';
import { AccountTypeEnum } from '../enums/account-type.enum';
import { TempleChainKind } from '../enums/temple-chain-kind.enum';
import { LoadableEntityState } from '../store/types';
import { AccountTokenInterface } from '../token/interfaces/account-token.interface';

import { ActivityGroup } from './activity.interface';

export interface AccountBaseInterface {
  name: string;
  /** @deprecated Tezos compatibility alias. Use getAccountAddressForTezos(account). */
  publicKeyHash: string;
}

export interface AccountInterface extends AccountBaseInterface {
  id: string;
  type: AccountTypeEnum;
  /** @deprecated Tezos compatibility alias. Use Shelter public-key reveal APIs. */
  publicKey: string;
  walletId?: string;
  hdIndex?: number;
  tezosAddress?: string;
  evmAddress?: HexString;
  chain?: TempleChainKind;
  address?: string;

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
  id: EMPTY_PUBLIC_KEY_HASH,
  name: '',
  type: AccountTypeEnum.HD_ACCOUNT,
  publicKey: '',
  publicKeyHash: EMPTY_PUBLIC_KEY_HASH,
  tezosAddress: EMPTY_PUBLIC_KEY_HASH
};

/** @deprecated // BAD PRACTICE */
export const emptyAccount: AccountInterface = {
  id: EMPTY_PUBLIC_KEY_HASH,
  name: '',
  type: AccountTypeEnum.HD_ACCOUNT,
  publicKey: '',
  publicKeyHash: EMPTY_PUBLIC_KEY_HASH,
  tezosAddress: EMPTY_PUBLIC_KEY_HASH
};

/** @deprecated // BAD PRACTICE */
export const emptyAccountBase: AccountBaseInterface = {
  name: '',
  publicKeyHash: EMPTY_PUBLIC_KEY_HASH
};
