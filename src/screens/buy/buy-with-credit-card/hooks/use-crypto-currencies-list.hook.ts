import { useMemo } from 'react';

import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { useCryptoCurrenciesSelector } from 'src/store/buy-with-credit-card/selectors';
import { TopUpInputInterface } from 'src/store/buy-with-credit-card/types';
import { isDefined } from 'src/utils/is-defined';

import { useFilteredCurrencies } from './use-filtered-currencies';

export const useCryptoCurrencies = () => {
  const moonpayCryptoCurrencies = useCryptoCurrenciesSelector(TopUpProviderEnum.MoonPay);
  const utorgCryptoCurrencies = useCryptoCurrenciesSelector(TopUpProviderEnum.Utorg);
  const aliceBobCryptoCurrencies = useCryptoCurrenciesSelector(TopUpProviderEnum.AliceBob);
  const binanceConnectCryptoCurrencies = useCryptoCurrenciesSelector(TopUpProviderEnum.BinanceConnect);

  const allCryptoCurrencies = useMemo(
    () =>
      Object.values(
        [
          ...moonpayCryptoCurrencies,
          ...utorgCryptoCurrencies,
          ...aliceBobCryptoCurrencies,
          ...binanceConnectCryptoCurrencies
        ].reduce<Record<string, TopUpInputInterface>>((acc, currency) => {
          if (!isDefined(acc[currency.code])) {
            acc[currency.code] = currency;
          }

          return acc;
        }, {})
      ).sort(({ code: aCode }, { code: bCode }) => aCode.localeCompare(bCode)),
    [moonpayCryptoCurrencies, utorgCryptoCurrencies, aliceBobCryptoCurrencies, binanceConnectCryptoCurrencies]
  );

  const filtered = useFilteredCurrencies(allCryptoCurrencies);

  return {
    allCryptoCurrencies,
    ...filtered
  };
};
