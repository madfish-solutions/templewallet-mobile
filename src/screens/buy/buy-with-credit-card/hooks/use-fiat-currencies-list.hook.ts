import { useMemo } from 'react';

import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { TopUpInputInterface } from 'src/interfaces/topup.interface';
import { useFiatCurrenciesSelector, usePairLimitsSelector } from 'src/store/buy-with-credit-card/selectors';
import { intersectAssetsLimits } from 'src/utils/intersect-assets-limits.utils';
import { isDefined } from 'src/utils/is-defined';
import { mergeAssetsLimits } from 'src/utils/merge-assets-limits.utils';

import { useFilteredCurrencies } from './use-filtered-currencies';

export const useFiatCurrenciesList = (inputCurrencySymbol: string, outputTokenSymbol: string) => {
  const moonpayFiatCurrencies = useFiatCurrenciesSelector(TopUpProviderEnum.MoonPay);
  const utorgFiatCurrencies = useFiatCurrenciesSelector(TopUpProviderEnum.Utorg);
  const aliceBobFiatCurrencies = useFiatCurrenciesSelector(TopUpProviderEnum.AliceBob);
  const binanceConnectFiatCurrencies = useFiatCurrenciesSelector(TopUpProviderEnum.BinanceConnect);

  const moonPayPairLimits = usePairLimitsSelector(inputCurrencySymbol, outputTokenSymbol, TopUpProviderEnum.MoonPay);
  const utorgPairLimits = usePairLimitsSelector(inputCurrencySymbol, outputTokenSymbol, TopUpProviderEnum.Utorg);
  const aliceBobPairLimits = usePairLimitsSelector(inputCurrencySymbol, outputTokenSymbol, TopUpProviderEnum.AliceBob);
  const binanceConnectPairLimits = usePairLimitsSelector(
    inputCurrencySymbol,
    outputTokenSymbol,
    TopUpProviderEnum.BinanceConnect
  );

  const pairLimits = useMemo(
    () =>
      mergeAssetsLimits(
        [moonPayPairLimits, utorgPairLimits, aliceBobPairLimits, binanceConnectPairLimits]
          .filter(isDefined)
          .map(({ data }) => data)
          .filter(isDefined)
      ),
    [moonPayPairLimits, utorgPairLimits, aliceBobPairLimits, binanceConnectPairLimits]
  );

  const noPairLimitsCurrencies = useMemo(
    () =>
      Object.values(
        [
          ...moonpayFiatCurrencies,
          ...utorgFiatCurrencies,
          ...aliceBobFiatCurrencies,
          ...binanceConnectFiatCurrencies
        ].reduce<Record<string, TopUpInputInterface>>((acc, currency) => {
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
    [moonpayFiatCurrencies, utorgFiatCurrencies, aliceBobFiatCurrencies, binanceConnectFiatCurrencies]
  );

  const currenciesWithPairLimits = useMemo(() => {
    const fiatCurrenciesWithPairLimits = [...noPairLimitsCurrencies];
    const inputCurrencyIndex = fiatCurrenciesWithPairLimits.findIndex(({ code }) => code === inputCurrencySymbol);
    if (inputCurrencyIndex !== -1) {
      const inputCurrency = fiatCurrenciesWithPairLimits[inputCurrencyIndex];
      const { min: minAmount, max: maxAmount } = intersectAssetsLimits([
        { min: inputCurrency.minAmount, max: inputCurrency.maxAmount },
        pairLimits
      ]);
      fiatCurrenciesWithPairLimits[inputCurrencyIndex] = {
        ...inputCurrency,
        minAmount,
        maxAmount
      };
    }

    return fiatCurrenciesWithPairLimits;
  }, [noPairLimitsCurrencies, pairLimits, inputCurrencySymbol]);

  return {
    ...useFilteredCurrencies(currenciesWithPairLimits),
    currenciesWithPairLimits,
    noPairLimitsCurrencies
  };
};
