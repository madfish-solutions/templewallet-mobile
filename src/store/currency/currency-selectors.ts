import { useSelector } from 'react-redux';

import { CurrencyRootState, ExchangeRateRecord } from './currency-state';

export const useExchangeRatesSelector = () =>
  useSelector<CurrencyRootState, ExchangeRateRecord>(({ currency }) => currency.exchangeRates.data);

export const useQuotesSelector = () =>
  useSelector<CurrencyRootState, ExchangeRateRecord>(({ currency }) => currency.quotes.data);
