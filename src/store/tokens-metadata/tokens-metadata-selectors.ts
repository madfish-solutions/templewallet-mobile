import { getTokenMetadata } from '../../utils/token-metadata.utils';
import { useSelector } from '../selector';

export const useTokenMetadataSelector = (slug: string) =>
  useSelector(
    state => getTokenMetadata(state, slug),
    (left, right) => JSON.stringify(left) === JSON.stringify(right)
  );

export const useTokensMetadataSelector = () =>
  useSelector(
    ({ tokensMetadata }) => tokensMetadata.metadataRecord,
    (left, right) => JSON.stringify(left) === JSON.stringify(right)
  );

export const useAddTokenSuggestionSelector = () =>
  useSelector(({ tokensMetadata }) => tokensMetadata.addTokenSuggestion);
