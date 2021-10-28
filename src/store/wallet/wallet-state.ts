import { WalletAccountStateInterface } from '../../interfaces/wallet-account-state.interface';
import { MAINNET_TOKENS_METADATA } from '../../token/data/tokens-metadata';
import { emptyTokenMetadata, TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface WalletState {
  accounts: WalletAccountStateInterface[];
  selectedAccountPublicKeyHash: string;
  tokensMetadata: Record<string, TokenMetadataInterface>;
  addTokenSuggestion: LoadableEntityState<TokenMetadataInterface>;
  isInternalOperationApproved: boolean | undefined;
}

export const walletInitialState: WalletState = {
  accounts: [],
  selectedAccountPublicKeyHash: '',
  tokensMetadata: MAINNET_TOKENS_METADATA.reduce(
    (obj, tokenMetadata) => ({
      ...obj,
      [getTokenSlug(tokenMetadata)]: tokenMetadata
    }),
    {}
  ),
  addTokenSuggestion: createEntity(emptyTokenMetadata),
  isInternalOperationApproved: undefined
};

export interface WalletRootState {
  wallet: WalletState;
}
