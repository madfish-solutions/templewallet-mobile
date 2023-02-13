import { jsonEqualityFn } from 'src/utils/store.utils';

import { useSelector } from '../selector';

export const useTokensMetadataSelector = () =>
  useSelector(({ tokensMetadata }) => tokensMetadata.metadataRecord, jsonEqualityFn);

export const useAddTokenSuggestionSelector = () =>
  useSelector(({ tokensMetadata }) => tokensMetadata.addTokenSuggestion);
