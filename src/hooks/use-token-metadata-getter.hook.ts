import { useCallback } from 'react';

import { useTokensMetadataSelector } from '../store/tokens-metadata/tokens-metadata-selectors';
import { TEZ_TOKEN_METADATA, TEZ_TOKEN_SLUG } from '../token/data/tokens-metadata';
import { emptyTokenMetadata, TokenMetadataInterface } from '../token/interfaces/token-metadata.interface';

export const useTokenMetadataGetter = () => {
  const tokensMetadata = useTokensMetadataSelector();

  return useCallback(
    (slug: string): TokenMetadataInterface => {
      const [tokenAddress, tokenId] = slug.split('_');

      return slug === TEZ_TOKEN_SLUG
        ? TEZ_TOKEN_METADATA
        : tokensMetadata[slug] ?? {
            ...emptyTokenMetadata,
            symbol: '???',
            name: `${tokenAddress} ${tokenId}`,
            address: tokenAddress,
            id: Number(tokenId ?? 0)
          };
    },
    [tokensMetadata]
  );
};
