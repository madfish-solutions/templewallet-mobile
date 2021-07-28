import { useCallback, useMemo } from 'react';

import { useTokensMetadataSelector } from '../store/wallet/wallet-selectors';
import { TEZ_TOKEN_METADATA } from '../token/data/tokens-metadata';
import { emptyTokenMetadata } from '../token/interfaces/token-metadata.interface';
import { isString } from '../utils/is-string';

export const useTokenMetadata = () => {
  const tokensMetadata = useTokensMetadataSelector();

  const getTokenMetadata = useCallback(
    (slug?: string) =>
      isString(slug) ? tokensMetadata[slug] ?? emptyTokenMetadata : { ...emptyTokenMetadata, ...TEZ_TOKEN_METADATA },
    [tokensMetadata]
  );

  return useMemo(() => ({ getTokenMetadata }), [getTokenMetadata]);
};
