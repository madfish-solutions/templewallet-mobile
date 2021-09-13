import { useCallback } from 'react';

import { useTokensMetadataSelector } from '../store/wallet/wallet-selectors';
import { TEZ_TOKEN_METADATA, TEZ_TOKEN_SLUG } from '../token/data/tokens-metadata';
import { emptyTokenMetadata } from '../token/interfaces/token-metadata.interface';

export const useTokenMetadataGetter = () => {
  const tokensMetadata = useTokensMetadataSelector();

  return useCallback(
    (slug: string) => (slug === TEZ_TOKEN_SLUG ? TEZ_TOKEN_METADATA : tokensMetadata[slug] ?? emptyTokenMetadata),
    [tokensMetadata]
  );
};
