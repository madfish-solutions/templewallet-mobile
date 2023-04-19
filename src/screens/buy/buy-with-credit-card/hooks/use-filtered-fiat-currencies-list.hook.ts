import { useMemo } from 'react';

import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { TopUpInputInterface } from 'src/interfaces/topup.interface';
import { useFiatCurrenciesSelector } from 'src/store/buy-with-credit-card/selectors';
import { isDefined } from 'src/utils/is-defined';

import { useFilteredCurrencies } from './use-filtered-currencies';

export const useFilteredFiatCurrencies = () => {
  const moonpayFiatCurrencies = useFiatCurrenciesSelector(TopUpProviderEnum.MoonPay);
  const utorgFiatCurrencies = useFiatCurrenciesSelector(TopUpProviderEnum.Utorg);
  const aliceBobFiatCurrencies = useFiatCurrenciesSelector(TopUpProviderEnum.AliceBob);

  const topUpCurrencies = useMemo(
    () =>
      Object.values(
        [...moonpayFiatCurrencies, ...utorgFiatCurrencies, ...aliceBobFiatCurrencies].reduce<
          Record<string, TopUpInputInterface>
        >((acc, currency) => {
          if (isDefined(acc[currency.code])) {
            const newTopUpCurrency = { ...acc[currency.code] };
            if (isDefined(currency.minAmount)) {
              newTopUpCurrency.minAmount = Math.min(newTopUpCurrency.minAmount ?? Infinity, currency.minAmount);
            }
            if (isDefined(currency.maxAmount)) {
              newTopUpCurrency.maxAmount = Math.max(newTopUpCurrency.maxAmount ?? -Infinity, currency.maxAmount);
            }
            acc[currency.code] = newTopUpCurrency;
          } else {
            acc[currency.code] = currency;
          }

          return acc;
        }, {})
      ).sort(({ code: aCode }, { code: bCode }) => aCode.localeCompare(bCode)),
    [moonpayFiatCurrencies, utorgFiatCurrencies, aliceBobFiatCurrencies]
  );

  return {
    ...useFilteredCurrencies(topUpCurrencies),
    allCurrencies: topUpCurrencies
  };
};
