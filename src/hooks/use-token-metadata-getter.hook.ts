import { useCallback } from 'react';

import { useTokensMetadataSelector } from '../store/tokens-metadata/tokens-metadata-selectors';
import { TokenMetadataInterface } from '../token/interfaces/token-metadata.interface';
import { normalizeTokenMetadata } from '../utils/token-metadata.utils';
import { useGasToken } from './use-gas-token.hook';
import { useTokenExchangeRateGetter } from './use-token-exchange-rate-getter.hook';

export const useTokenMetadataGetter = () => {
  const tokensMetadata = useTokensMetadataSelector();
  const getTokenExchangeRate = useTokenExchangeRateGetter();
  const { metadata } = useGasToken();

  return useCallback(
    (slug: string): TokenMetadataInterface => {
      const tokenMetadata = normalizeTokenMetadata(slug, metadata, tokensMetadata[slug]);
      const exchangeRate = getTokenExchangeRate(slug);

      return {
        ...tokenMetadata,
        exchangeRate
      };
    },
    [tokensMetadata, getTokenExchangeRate]
  );
};
