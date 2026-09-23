import { KNOWN_MAINNET_TOKENS_METADATA, PREDEFINED_DCP_TOKENS_METADATA } from 'src/token/data/tokens-metadata';
import { emptyTokenMetadata, TezosTokenMetadata } from 'src/token/interfaces/token-metadata.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface TokensMetadataState {
  isLoading: boolean;
  metadataRecord: Record<string, TezosTokenMetadata>;
  addTokenSuggestion: LoadableEntityState<TezosTokenMetadata>;
  knownSvgs: Record<string, boolean>;
  scamTokenSlugs: LoadableEntityState<Record<string, boolean>>;
}

export const tokensMetadataInitialState: TokensMetadataState = {
  isLoading: false,
  metadataRecord: [...KNOWN_MAINNET_TOKENS_METADATA, ...PREDEFINED_DCP_TOKENS_METADATA].reduce(
    (obj, tokenMetadata) => ({
      ...obj,
      [getTokenSlug(tokenMetadata)]: tokenMetadata
    }),
    {}
  ),
  addTokenSuggestion: createEntity(emptyTokenMetadata),
  knownSvgs: {},
  scamTokenSlugs: createEntity({})
};
