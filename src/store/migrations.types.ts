import { PersistedState } from 'redux-persist';

import type { Account } from 'src/interfaces/account.interfaces';
import { ActivityGroup } from 'src/interfaces/activity.interface.ts';
import { LoadableEntityState } from 'src/store/types.ts';
import { AccountTokenInterface } from 'src/token/interfaces/account-token.interface.ts';
import { TokenMetadataInterface } from 'src/token/interfaces/token-metadata.interface.ts';

import type { RootState } from './types';

export const LEGACY_IMPORTED_ACCOUNT_TYPE = 'IMPORTED' as const;

export type MigratableAccount = WithLegacyProperties<Account, LegacyAccountInterface> | LegacyImportedAccountInterface;
export type TypedPersistedRootState = Exclude<PersistedState, undefined> & MigratableRootState;

type WithLegacyProperties<Current extends object, Legacy extends object> = Current extends object
  ? Omit<Current, keyof Legacy> & Legacy
  : never;

type MigratableWalletState = WithLegacyProperties<
  Omit<RootState['wallet'], 'accounts'> & { accounts: MigratableAccount[] },
  LegacyWalletState
>;

type MigratableRootState = Omit<RootState, 'wallet'> & { wallet: MigratableWalletState };

interface LegacyAccountInterface {
  /** @deprecated */
  publicKeyHash?: string;
  /** @deprecated */
  publicKey?: string;
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

interface LegacyImportedAccountInterface extends LegacyAccountInterface {
  name: string;
  type: typeof LEGACY_IMPORTED_ACCOUNT_TYPE;
}

interface LegacyWalletState {
  /** @deprecated */
  selectedAccountPublicKeyHash?: string;
  /** @deprecated */
  tokensMetadata?: Record<string, TokenMetadataInterface>;
  /** @deprecated */
  addTokenSuggestion?: LoadableEntityState<TokenMetadataInterface>;
  /** @deprecated */
  isShownDomainName?: boolean;
  /** @deprecated */
  quipuApy?: number;
}
