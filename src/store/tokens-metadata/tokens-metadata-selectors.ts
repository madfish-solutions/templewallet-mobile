import { useSelector } from 'react-redux';

import { TokensMetadataRootState, TokensMetadataState } from './tokens-metadata-state';

export const useTokensMetadataSelector = () =>
  useSelector<TokensMetadataRootState, TokensMetadataState['metadataRecord']>(
    ({ tokensMetadata }) => tokensMetadata.metadataRecord,
    (left, right) => JSON.stringify(left) === JSON.stringify(right)
  );

export const useAddTokenSuggestionSelector = () =>
  useSelector<TokensMetadataRootState, TokensMetadataState['addTokenSuggestion']>(
    ({ tokensMetadata }) => tokensMetadata.addTokenSuggestion
  );
