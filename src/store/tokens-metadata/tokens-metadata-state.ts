import {
  DCP_TOKENS_METADATA,
  HIDDEN_WHITELIST_TOKENS,
  MAINNET_TOKENS_METADATA
} from '../../token/data/tokens-metadata';
import { emptyTokenMetadata, TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface TokensMetadataState {
  metadataRecord: Record<string, TokenMetadataInterface>;
  dcpMetadataRecord: Record<string, TokenMetadataInterface>;
  addTokenSuggestion: LoadableEntityState<TokenMetadataInterface>;
}

export const tokensMetadataInitialState: TokensMetadataState = {
  metadataRecord: [...MAINNET_TOKENS_METADATA, ...HIDDEN_WHITELIST_TOKENS].reduce(
    (obj, tokenMetadata) => ({
      ...obj,
      [getTokenSlug(tokenMetadata)]: tokenMetadata
    }),
    {}
  ),
  dcpMetadataRecord: [...DCP_TOKENS_METADATA].reduce(
    (obj, tokenMetadata) => ({
      ...obj,
      [getTokenSlug(tokenMetadata)]: tokenMetadata
    }),
    {}
  ),
  addTokenSuggestion: createEntity(emptyTokenMetadata)
};

export interface TokensMetadataRootState {
  tokensMetadata: TokensMetadataState;
}
