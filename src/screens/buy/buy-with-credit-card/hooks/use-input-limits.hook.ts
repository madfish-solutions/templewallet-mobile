import { useMemo } from 'react';

import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { usePairLimitsByProvidersSelector, usePairLimitsSelector } from 'src/store/buy-with-credit-card/selectors';
import { isDefined } from 'src/utils/is-defined';
import { PairLimits } from 'src/utils/pair-limits';

export const useInputLimits = (
  topUpProvider: TopUpProviderEnum,
  fiatCurrencyCode: string,
  cryptoCurrencySlug: string
): Partial<PairLimits> => {
  const pairLimits = usePairLimitsSelector(fiatCurrencyCode, cryptoCurrencySlug, topUpProvider);

  return useMemo(() => pairLimits?.data ?? {}, [pairLimits]);
};

export const usePairLimitsAreLoading = (fiatCurrencyCode: string, cryptoCurrencySlug: string) => {
  const pairLimits = usePairLimitsByProvidersSelector(fiatCurrencyCode, cryptoCurrencySlug);

  return useMemo(
    () => isDefined(pairLimits) && Object.values(pairLimits).some(({ isLoading }) => isLoading),
    [pairLimits]
  );
};
