import { mockFA1_2TokenMetadata, mockFA2TokenMetadata } from '../../token/interfaces/token-metadata.interface.mock';
import { getTokenSlug } from '../../token/utils/token.utils';
import { createEntity } from '../create-entity';
import { TokensMetadataState } from './tokens-metadata-state';

export const mockTokensMetadataState: TokensMetadataState = {
  metadataRecord: {
    [getTokenSlug(mockFA1_2TokenMetadata)]: mockFA1_2TokenMetadata,
    [getTokenSlug(mockFA2TokenMetadata)]: mockFA2TokenMetadata
  },
  addTokenSuggestion: createEntity(mockFA1_2TokenMetadata)
};
