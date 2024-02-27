import { TokenMetadataInterface } from 'src/token/interfaces/token-metadata.interface';

import { useSelector } from '../selector';

export const useAreMetadatasLoadingSelector = () => useSelector(state => state.tokensMetadata.isLoading);

export const useTokensMetadataSelector = () => useSelector(({ tokensMetadata }) => tokensMetadata.metadataRecord);

export const useAssetMetadataSelector = (slug: string): TokenMetadataInterface | undefined =>
  useSelector(({ tokensMetadata }) => tokensMetadata.metadataRecord[slug]);

export const useAddTokenSuggestionSelector = () =>
  useSelector(({ tokensMetadata }) => tokensMetadata.addTokenSuggestion);

export const useIsKnownSvgSelector = (url: string) =>
  useSelector(({ tokensMetadata }) => Boolean(tokensMetadata.knownSvgs[url]));

export const useScamTokenSlugsSelector = () => useSelector(({ tokensMetadata }) => tokensMetadata.scamTokenSlugs.data);
