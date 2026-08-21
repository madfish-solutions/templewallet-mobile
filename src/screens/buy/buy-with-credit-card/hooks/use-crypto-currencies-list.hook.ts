import { useMemo } from 'react';

import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { useCryptoCurrenciesSelector } from 'src/store/buy-with-credit-card/selectors';
import { TopUpOutputInterface } from 'src/store/buy-with-credit-card/types';
import { isDefined } from 'src/utils/is-defined';

import { useFilteredCurrencies } from './use-filtered-currencies';

export const useCryptoCurrencies = () => {
  const moonpayCryptoCurrencies = useCryptoCurrenciesSelector(TopUpProviderEnum.MoonPay);
  const mtPelerinCryptoCurrencies = useCryptoCurrenciesSelector(TopUpProviderEnum.MtPelerin);

  const allCryptoCurrencies = useMemo(
    () =>
      Object.values(
        [...moonpayCryptoCurrencies, ...mtPelerinCryptoCurrencies].reduce<Record<string, TopUpOutputInterface>>(
          (acc, currency) => {
            if (!isDefined(acc[currency.slug])) {
              acc[currency.slug] = currency;
            }

            return acc;
          },
          {}
        )
      ).sort(({ code: aCode }, { code: bCode }) => aCode.localeCompare(bCode)),
    [moonpayCryptoCurrencies, mtPelerinCryptoCurrencies]
  );

  const filtered = useFilteredCurrencies(allCryptoCurrencies);

  return {
    allCryptoCurrencies,
    ...filtered
  };
};
