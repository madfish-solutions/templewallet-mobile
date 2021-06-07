import { useCallback } from 'react';

import { useTokensMetadataSelector } from '../store/wallet/wallet-selectors';
import { XTZ_TOKEN_METADATA } from '../token/data/tokens-metadata';
import { emptyTokenMetadata } from '../token/interfaces/token-metadata.interface';
import { isDefined } from '../utils/is-defined';

export const useTokenMetadata = () => {
  const tokensMetadata = useTokensMetadataSelector();

  const getTokenMetadata = useCallback(
    (slug?: string) => (isDefined(slug) ? tokensMetadata[slug] ?? emptyTokenMetadata : XTZ_TOKEN_METADATA),
    [tokensMetadata]
  );

  return { getTokenMetadata };
};
