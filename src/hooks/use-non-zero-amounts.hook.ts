import { TokenDelta } from '@temple-wallet/transactions-parser';
import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';

import { ActivityAmount } from 'src/interfaces/non-zero-amounts.interface';
import { useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';

import { useUsdToTokenRates } from '../store/currency/currency-selectors';
import { isDefined } from '../utils/is-defined';
import { isCollectible, mutezToTz } from '../utils/tezos.util';
import { useTokenMetadataGetterNew } from './use-token-metadata-getter.hook';

export const calculateFiatAmount = (
  parsedAmount: BigNumber,
  exchangeRate: number | undefined,
  fiatToUsdRate: number | undefined
) => {
  if (isDefined(exchangeRate) && isDefined(fiatToUsdRate)) {
    return parsedAmount.absoluteValue().multipliedBy(exchangeRate).multipliedBy(fiatToUsdRate);
  }
};

export const useNonZeroAmounts = (tokensDeltas: Array<TokenDelta>): Array<ActivityAmount> => {
  const getTokenMetadata = useTokenMetadataGetterNew();
  const exchangeRates = useUsdToTokenRates();
  const fiatToUsdRate = useFiatToUsdRateSelector();

  return useMemo(() => {
    const amounts: Array<ActivityAmount> = [];

    for (const { atomicAmount, tokenSlug } of tokensDeltas) {
      const metadata = getTokenMetadata(tokenSlug);
      const exchangeRate: number | undefined = exchangeRates[tokenSlug];

      const isPositive = atomicAmount.isPositive();

      if (isDefined(metadata)) {
        const { name, symbol, decimals } = metadata;

        const parsedAmount = mutezToTz(atomicAmount, decimals);

        if (!parsedAmount.isEqualTo(0)) {
          amounts.push({
            isPositive,
            parsedAmount,
            exchangeRate,
            symbol: isCollectible(metadata) ? name : symbol,
            fiatAmount: calculateFiatAmount(parsedAmount, exchangeRate, fiatToUsdRate)
          });
        }
      } else {
        amounts.push({
          isPositive,
          parsedAmount: undefined,
          exchangeRate: undefined,
          symbol: '---',
          fiatAmount: undefined
        });
      }
    }

    return amounts;
  }, [tokensDeltas, getTokenMetadata, exchangeRates]);
};
