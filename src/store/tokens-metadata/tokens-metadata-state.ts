import { DCP_TOKENS_METADATA } from '../../token/data/tokens-metadata';
import { emptyTokenMetadata, TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface TokensMetadataState {
  metadataRecord: Record<string, TokenMetadataInterface>;
  addTokenSuggestion: LoadableEntityState<TokenMetadataInterface>;
}

export const tokensMetadataInitialState: TokensMetadataState = {
  metadataRecord: DCP_TOKENS_METADATA.reduce(
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
