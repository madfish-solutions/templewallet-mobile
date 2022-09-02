import { useSelector } from 'react-redux';

import { CurrencyRootState, ExchangeRateRecord } from './currency-state';

export const useUsdToTokenRates = () =>
  useSelector<CurrencyRootState, ExchangeRateRecord>(({ currency }) => currency.usdToTokenRates.data);
