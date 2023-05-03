import { useMemo } from 'react';

import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { useFiatCurrenciesSelector, usePairLimitsSelector } from 'src/store/buy-with-credit-card/selectors';
import { intersectAssetsLimits } from 'src/utils/intersect-assets-limits.utils';
import { isDefined } from 'src/utils/is-defined';

export const useInputLimits = (
  topUpProvider: TopUpProviderEnum,
  fiatCurrencyCode: string,
  cryptoCurrencyCode: string
) => {
  const fiatCurrencies = useFiatCurrenciesSelector(topUpProvider);
  const fiatCurrency = fiatCurrencies.find(({ code }) => code === fiatCurrencyCode);
  const pairLimits = usePairLimitsSelector(fiatCurrencyCode, cryptoCurrencyCode, topUpProvider);

  return useMemo(() => {
    if (isDefined(pairLimits) && !isDefined(pairLimits.data) && isDefined(pairLimits.error)) {
      return {};
    }

    return intersectAssetsLimits([pairLimits?.data, { min: fiatCurrency?.minAmount, max: fiatCurrency?.maxAmount }]);
  }, [pairLimits, fiatCurrency]);
};
