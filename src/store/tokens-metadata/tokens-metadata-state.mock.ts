import { mockFA1_2TokenMetadata, mockFA2TokenMetadata } from 'src/token/interfaces/token-metadata.interface.mock';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { mockPersistedState } from 'src/utils/redux';

import { createEntity } from '../create-entity';

import { TokensMetadataState } from './tokens-metadata-state';

export const mockTokensMetadataState = mockPersistedState<TokensMetadataState>({
  isLoading: false,
  metadataRecord: {
    [getTokenSlug(mockFA1_2TokenMetadata)]: mockFA1_2TokenMetadata,
    [getTokenSlug(mockFA2TokenMetadata)]: mockFA2TokenMetadata
  },
  addTokenSuggestion: createEntity(mockFA1_2TokenMetadata),
  knownSvgs: {},
  scamTokenSlugs: createEntity({})
});
