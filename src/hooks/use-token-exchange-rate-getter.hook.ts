import { useCallback } from 'react';

import { useUsdToTokenRates } from 'src/store/currency/currency-selectors';
import { isDefined } from 'src/utils/is-defined';
import { useFiatToUsdRate } from 'src/utils/token-metadata.utils';

export const useTokenExchangeRateGetter = () => {
  const tokenUsdExchangeRates = useUsdToTokenRates();
  const fiatToUsdRate = useFiatToUsdRate();

  return useCallback(
    (slug: string) => {
      const tokenUsdExchangeRate = tokenUsdExchangeRates[slug];

      return isDefined(tokenUsdExchangeRate) && isDefined(fiatToUsdRate)
        ? tokenUsdExchangeRate * fiatToUsdRate
        : undefined;
    },
    [tokenUsdExchangeRates, fiatToUsdRate]
  );
};
