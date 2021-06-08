import { OperationErrorPayload } from '../../interfaces/operation-error-payload';
import { OperationSuccessPayload } from '../../interfaces/operation-success-payload';
import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';
import { MAINNET_TOKENS_METADATA } from '../../token/data/tokens-metadata';
import { emptyTokenMetadata, TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { tokenMetadataSlug } from '../../token/utils/token.utils';
import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface WalletState {
  hdAccounts: WalletAccountInterface[];
  selectedAccountPublicKeyHash: string;
  tokensMetadata: Record<string, TokenMetadataInterface>;
  addTokenSuggestion: LoadableEntityState<TokenMetadataInterface>;
  pendingOperations: OperationSuccessPayload[];
  completedOperations: OperationSuccessPayload[];
  confirmationErrorOperations: OperationErrorPayload[];
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
  pendingOperations: [],
  completedOperations: [],
  confirmationErrorOperations: []
};

export interface WalletRootState {
  wallet: WalletState;
}
