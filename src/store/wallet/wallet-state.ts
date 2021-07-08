import { EstimationInterface } from '../../interfaces/estimation.interface';
import { WalletAccountStateInterface } from '../../interfaces/wallet-account-state.interface';
import { MAINNET_TOKENS_METADATA } from '../../token/data/tokens-metadata';
import { emptyTokenMetadata, TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { tokenMetadataSlug } from '../../token/utils/token.utils';
import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface WalletState {
  hdAccounts: WalletAccountStateInterface[];
  selectedAccountPublicKeyHash: string;
  tokensMetadata: Record<string, TokenMetadataInterface>;
  addTokenSuggestion: LoadableEntityState<TokenMetadataInterface>;
  estimations: LoadableEntityState<EstimationInterface[]>;
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
  addTokenSuggestion: createEntity(emptyTokenMetadata),
  estimations: createEntity([])
};

export interface WalletRootState {
  wallet: WalletState;
}
