import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { TEZ_TOKEN_SLUG } from '../../token/data/tokens-metadata';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { isDefined } from '../../utils/is-defined';
import { useFiatCurrencySelector } from '../settings/settings-selectors';
import { CurrencyRootState, ExchangeRateRecord } from './currency-state';

export const useUsdToTokenRates = () =>
  useSelector<CurrencyRootState, ExchangeRateRecord>(({ currency }) => currency.usdToTokenRates.data);

export const useFiatToTezosRates = () =>
  useSelector<CurrencyRootState, ExchangeRateRecord>(({ currency }) => currency.fiatToTezosRates.data);

export const useExchangeRate = <T extends { address?: string; id?: number }>(asset: T) => {
  const exchangeRates = useUsdToTokenRates();
  const quotes = useFiatToTezosRates();
  const exchangeRate: number | undefined = exchangeRates[getTokenSlug(asset)];
  const exchangeRateTezos: number | undefined = exchangeRates[TEZ_TOKEN_SLUG];

  const fiatCurrency = useFiatCurrencySelector();

  const fiatToUsdRate = quotes[fiatCurrency.toLowerCase()] / exchangeRateTezos;
  const trueExchangeRate = fiatToUsdRate * exchangeRate;

  const hasExchangeRate = isDefined(exchangeRate);

  const getExchangeRate = useCallback(
    (newAsset: TokenInterface): number | undefined => {
      if (!exchangeRate) {
        return;
      }
      const newExchangeRate = exchangeRates[getTokenSlug(newAsset)];
      const newFiatToUsdRate = quotes[fiatCurrency.toLowerCase()] / exchangeRateTezos;
      const newTrueExchangeRate = newFiatToUsdRate * newExchangeRate;

      return newTrueExchangeRate;
    },
    [exchangeRates, quotes, fiatCurrency, exchangeRateTezos]
  );

  return {
    getExchangeRate,
    hasExchangeRate,
    exchangeRate: isNaN(trueExchangeRate) ? undefined : trueExchangeRate
  };
};
