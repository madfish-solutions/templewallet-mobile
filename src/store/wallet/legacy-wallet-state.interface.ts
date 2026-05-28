import { TokenMetadataInterface } from 'src/token/interfaces/token-metadata.interface';

import { LoadableEntityState } from '../types';

export interface LegacyWalletState {
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
