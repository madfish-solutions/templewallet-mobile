import { AccountStateInterface } from 'src/interfaces/account-state.interface';
import { AccountInterface } from 'src/interfaces/account.interface';
import { TokenMetadataInterface } from 'src/token/interfaces/token-metadata.interface';

import { LoadableEntityState } from '../types';

export interface WalletState {
  accounts: AccountInterface[];
  accountsStateRecord: Record<string, AccountStateInterface>;
  selectedAccountPublicKeyHash: string;

  /** @deprecated */
  tokensMetadata?: Record<string, TokenMetadataInterface>;
  /** @deprecated */
  addTokenSuggestion?: LoadableEntityState<TokenMetadataInterface>;
  /** @deprecated */
  isShownDomainName?: boolean;
  /** @deprecated */
  quipuApy?: number;
}

export const walletInitialState: WalletState = {
  accounts: [],
  accountsStateRecord: {},
  selectedAccountPublicKeyHash: ''
};
