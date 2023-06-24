import { jsonEqualityFn } from '../../utils/store.utils';
import { getTokenMetadata } from '../../utils/token-metadata.utils';
import { useSelector } from '../selector';

export const useTokenMetadataSelector = (slug: string) =>
  useSelector(state => getTokenMetadata(state, slug), jsonEqualityFn);

export const useTokensMetadataSelector = () =>
  useSelector(({ tokensMetadata }) => tokensMetadata.metadataRecord, jsonEqualityFn);

export const useAddTokenSuggestionSelector = () =>
  useSelector(({ tokensMetadata }) => tokensMetadata.addTokenSuggestion);

export const useIsKnownSvgSelector = (url: string) =>
  useSelector(({ tokensMetadata }) => Boolean(tokensMetadata.knownSvgs[url]));
