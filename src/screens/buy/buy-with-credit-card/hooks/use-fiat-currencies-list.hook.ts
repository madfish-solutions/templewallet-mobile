import { useMemo } from 'react';

import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { useFiatCurrenciesSelector, usePairLimitsByProvidersSelector } from 'src/store/buy-with-credit-card/selectors';
import { TopUpInputInterface } from 'src/store/buy-with-credit-card/types';
import { isDefined } from 'src/utils/is-defined';

import { mergeProvidersLimits } from '../utils';

import { useFilteredCurrencies } from './use-filtered-currencies';

export const useFiatCurrenciesList = (inputCurrencySymbol: string, outputTokenSymbol: string) => {
  const moonpayFiatCurrencies = useFiatCurrenciesSelector(TopUpProviderEnum.MoonPay);
  const utorgFiatCurrencies = useFiatCurrenciesSelector(TopUpProviderEnum.Utorg);
  const aliceBobFiatCurrencies = useFiatCurrenciesSelector(TopUpProviderEnum.AliceBob);

  const pairLimitsByProviders = usePairLimitsByProvidersSelector(inputCurrencySymbol, outputTokenSymbol);

  const pairLimits = useMemo(() => mergeProvidersLimits(pairLimitsByProviders), [pairLimitsByProviders]);

  const noPairLimitsFiatCurrencies = useMemo(
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
              newTopUpCurrency.maxAmount = Math.max(newTopUpCurrency.maxAmount ?? 0, currency.maxAmount);
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

  const currenciesWithPairLimits = useMemo(() => {
    const inputCurrencyIndex = noPairLimitsFiatCurrencies.findIndex(({ code }) => code === inputCurrencySymbol);
    if (inputCurrencyIndex === -1) {
      return noPairLimitsFiatCurrencies;
    }

    const fiatCurrenciesWithPairLimits = [...noPairLimitsFiatCurrencies];
    const inputCurrency = fiatCurrenciesWithPairLimits[inputCurrencyIndex];

    const { min: minAmount, max: maxAmount } = pairLimits;
    fiatCurrenciesWithPairLimits[inputCurrencyIndex] = {
      ...inputCurrency,
      minAmount,
      maxAmount
    };

    return fiatCurrenciesWithPairLimits;
  }, [noPairLimitsFiatCurrencies, pairLimits, inputCurrencySymbol]);

  const filtered = useFilteredCurrencies(currenciesWithPairLimits);

  return {
    currenciesWithPairLimits,
    noPairLimitsFiatCurrencies,
    ...filtered
  };
};
