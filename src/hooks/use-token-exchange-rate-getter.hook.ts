import { useCallback } from 'react';

import { useUsdToTokenRates } from '../store/currency/currency-selectors';
import { useFiatToUsdRateSelector } from '../store/settings/settings-selectors';
import { getExchangeRateSlug } from '../token/data/tokens-metadata';
import { isDefined } from '../utils/is-defined';

export const useTokenExchangeRateGetter = () => {
  const tokenUsdExchangeRates = useUsdToTokenRates();
  const fiatToUsdRate = useFiatToUsdRateSelector();

  return useCallback(
    (slug: string) => {
      const rateSlug = getExchangeRateSlug(slug);
      const tokenUsdExchangeRate = tokenUsdExchangeRates[rateSlug];

      return isDefined(tokenUsdExchangeRate) && isDefined(fiatToUsdRate)
        ? tokenUsdExchangeRate * fiatToUsdRate
        : undefined;
    },
    [tokenUsdExchangeRates, fiatToUsdRate]
  );
};
