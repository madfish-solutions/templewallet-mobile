import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';
import { MAINNET_TOKENS_METADATA } from '../../token/data/tokens-metadata';
import { emptyTokenMetadataInterface, TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { tokenMetadataSlug } from '../../token/utils/token.utils';
import { LoadableEntityState } from '../types';

export interface WalletState {
  hdAccounts: WalletAccountInterface[];
  selectedAccountPublicKeyHash: string;
  tokensMetadata: Record<string, TokenMetadataInterface>;
  addTokenSuggestion: LoadableEntityState<TokenMetadataInterface>;
}

export const walletInitialState: WalletState = {
  hdAccounts: [],
  selectedAccountPublicKeyHash: '',
  tokensMetadata: MAINNET_TOKENS_METADATA.reduce(
    (obj, tokenMetadata) => ({
      ...obj,
      [tokenMetadataSlug(tokenMetadata)]: tokenMetadata
    }),
    {}
  ),
  addTokenSuggestion: {
    isLoading: false,
    data: emptyTokenMetadataInterface
  }
};

export interface WalletRootState {
  wallet: WalletState;
}
