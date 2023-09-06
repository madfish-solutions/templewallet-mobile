import { useCallback } from 'react';

import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { getNetworkGasTokenMetadata } from 'src/utils/network.utils';

import { useSelectedRpcUrlSelector } from '../store/settings/settings-selectors';
import { useTokensMetadataSelector } from '../store/tokens-metadata/tokens-metadata-selectors';
import { TokenMetadataInterface } from '../token/interfaces/token-metadata.interface';
import { normalizeTokenMetadata } from '../utils/token-metadata.utils';
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

export const useTokenMetadataGetterNew = () => {
  const tokensMetadata = useTokensMetadataSelector();
  const getTokenExchangeRate = useTokenExchangeRateGetter();
  const selectedRpcUrl = useSelectedRpcUrlSelector();

  return useCallback(
    (slug: string): TokenMetadataInterface | undefined => {
      if (slug === TEZ_TOKEN_SLUG) {
        return getNetworkGasTokenMetadata(selectedRpcUrl);
      }

      return tokensMetadata[slug];
    },
    [tokensMetadata, selectedRpcUrl, getTokenExchangeRate]
  );
};
