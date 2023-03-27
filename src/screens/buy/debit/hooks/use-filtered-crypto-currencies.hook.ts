import { useMemo } from 'react';

import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { TopUpInputInterface } from 'src/interfaces/topup.interface';
import { useCryptoCurrenciesSelector } from 'src/store/buy-with-credit-card/buy-with-credit-card-selectors';
import { isDefined } from 'src/utils/is-defined';

import { useFilteredCurrencies } from './use-filtered-currencies';

export const useFilteredCryptoCurrencies = () => {
  const moonpayFiatCurrencies = useCryptoCurrenciesSelector(TopUpProviderEnum.MoonPay);
  const utorgFiatCurrencies = useCryptoCurrenciesSelector(TopUpProviderEnum.Utorg);
  const aliceBobFiatCurrencies = useCryptoCurrenciesSelector(TopUpProviderEnum.AliceBob);

  const topUpCurrencies = useMemo(
    () =>
      Object.values(
        [...utorgFiatCurrencies, ...moonpayFiatCurrencies, ...aliceBobFiatCurrencies].reduce<
          Record<string, TopUpInputInterface>
        >((acc, currency) => {
          if (!isDefined(acc[currency.code])) {
            acc[currency.code] = currency;
          }

          return acc;
        }, {})
      ).sort(({ code: aCode }, { code: bCode }) => aCode.localeCompare(bCode)),
    [moonpayFiatCurrencies, utorgFiatCurrencies, aliceBobFiatCurrencies]
  );

  return useFilteredCurrencies(topUpCurrencies);
};
