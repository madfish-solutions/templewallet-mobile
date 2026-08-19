import { useCallback } from 'react';

import { useUsdToTokenRates } from '../store/currency/currency-selectors';
import { useFiatToUsdRateSelector } from '../store/settings/settings-selectors';
import { getExchangeRateSlug } from '../token/data/tokens-metadata';
import { getFiatExchangeRate } from '../utils/get-fiat-exchange-rate';

export const useTokenExchangeRateGetter = () => {
  const tokenUsdExchangeRates = useUsdToTokenRates();
  const fiatToUsdRate = useFiatToUsdRateSelector();

  return useCallback(
    (slug: string) => {
      const rateSlug = getExchangeRateSlug(slug);

      return getFiatExchangeRate(tokenUsdExchangeRates[rateSlug], fiatToUsdRate);
    },
    [tokenUsdExchangeRates, fiatToUsdRate]
  );
};
