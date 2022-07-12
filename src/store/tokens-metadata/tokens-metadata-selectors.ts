import { useSelector } from 'react-redux';

import { TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { getTokenMetadata } from '../../utils/token-metadata.utils';
import { RootState } from '../create-store';
import { TokensMetadataRootState, TokensMetadataState } from './tokens-metadata-state';

export const useTokenMetadataSelector = (slug: string) =>
  useSelector<RootState, TokenMetadataInterface>(
    state => getTokenMetadata(state, slug),
    (left, right) => JSON.stringify(left) === JSON.stringify(right)
  );

export const useTokensMetadataSelector = () =>
  useSelector<TokensMetadataRootState, TokensMetadataState['metadataRecord']>(
    ({ tokensMetadata }) => tokensMetadata.metadataRecord,
    (left, right) => JSON.stringify(left) === JSON.stringify(right)
  );

export const useAddTokenSuggestionSelector = () =>
  useSelector<TokensMetadataRootState, TokensMetadataState['addTokenSuggestion']>(
    ({ tokensMetadata }) => tokensMetadata.addTokenSuggestion
  );
