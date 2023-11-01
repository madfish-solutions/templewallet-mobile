import { useCallback } from 'react';

import { UNKNOWN_TOKEN_SYMBOL } from 'src/config/general';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { useTokenExchangeRateGetter } from 'src/hooks/use-token-exchange-rate-getter.hook';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { useTokensMetadataSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { useCurrentAccountTezosBalance, useTokenBalanceGetter } from 'src/store/wallet/wallet-selectors';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { emptyTokenMetadata } from 'src/token/interfaces/token-metadata.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getNetworkGasTokenMetadata } from 'src/utils/network.utils';

export const useTokenGetter = () => {
  const tokensMetadata = useTokensMetadataSelector();
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const tezBalance = useCurrentAccountTezosBalance();
  const getTokenBalance = useTokenBalanceGetter();
  const getTokenExchangeRate = useTokenExchangeRateGetter();

  return useCallback(
    (slug: string): TokenInterface => {
      const exchangeRate = getTokenExchangeRate(slug);
      const visibility = VisibilityEnum.Visible;

      if (slug === TEZ_TOKEN_SLUG) {
        return {
          ...getNetworkGasTokenMetadata(selectedRpcUrl),
          visibility,
          balance: tezBalance,
          exchangeRate
        };
      }

      let metadata = tokensMetadata[slug];
      if (!metadata) {
        const [tokenAddress, tokenId] = slug.split('_');
        metadata = {
          ...emptyTokenMetadata,
          symbol: UNKNOWN_TOKEN_SYMBOL,
          name: `${tokenAddress} ${tokenId}`,
          address: tokenAddress,
          id: Number(tokenId ?? 0)
        };
      }

      return {
        ...metadata,
        visibility,
        balance: getTokenBalance(slug) ?? '0',
        exchangeRate
      };
    },
    [tokensMetadata, selectedRpcUrl, tezBalance, getTokenBalance, getTokenExchangeRate]
  );
};
