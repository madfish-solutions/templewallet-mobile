import { useCallback } from 'react';

import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { useTokensMetadataSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { TokenMetadataInterface } from 'src/token/interfaces/token-metadata.interface';
import { normalizeTokenMetadata } from 'src/utils/token-metadata.utils';

import { useTokenExchangeRateGetter } from './use-token-exchange-rate-getter.hook';

export const useTokenMetadataGetter = () => {
  const tokensMetadata = useTokensMetadataSelector();
  const getTokenExchangeRate = useTokenExchangeRateGetter();
  const selectedRpcUrl = useSelectedRpcUrlSelector();

  return useCallback(
    (slug: string): TokenMetadataInterface => {
      const tokenMetadata = normalizeTokenMetadata(selectedRpcUrl, slug, tokensMetadata[slug]);
      const exchangeRate = getTokenExchangeRate(slug);

      return {
        ...tokenMetadata,
        exchangeRate
      };
    },
    [tokensMetadata, getTokenExchangeRate]
  );
};
