import { useSelector } from 'react-redux';

import { CurrencyRootState, ExchangeRateRecord } from './currency-state';

export const useUsdToTokenRates = () =>
  useSelector<CurrencyRootState, ExchangeRateRecord>(({ currency }) => currency.usdToTokenRates.data);

export const useUsdToTokenRate = (slug: string) =>
  useSelector<CurrencyRootState, number | undefined>(({ currency }) => currency.usdToTokenRates.data[slug]);
