import { WalletAccountStateInterface } from '../../interfaces/wallet-account-state.interface';
import { HIDDEN_WHITELIST_TOKENS, MAINNET_TOKENS_METADATA } from '../../token/data/tokens-metadata';
import { emptyTokenMetadata, TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface WalletState {
  accounts: WalletAccountStateInterface[];
  selectedAccountPublicKeyHash: string;
  tokensMetadata: Record<string, TokenMetadataInterface>;
  addTokenSuggestion: LoadableEntityState<TokenMetadataInterface>;
  isShownDomainName: boolean;
}

export const walletInitialState: WalletState = {
  accounts: [],
  selectedAccountPublicKeyHash: '',
  tokensMetadata: [...MAINNET_TOKENS_METADATA, ...HIDDEN_WHITELIST_TOKENS].reduce(
    (obj, tokenMetadata) => ({
      ...obj,
      [getTokenSlug(tokenMetadata)]: tokenMetadata
    }),
    {}
  ),
  addTokenSuggestion: createEntity(emptyTokenMetadata),
  isShownDomainName: false
};

export interface WalletRootState {
  wallet: WalletState;
}
