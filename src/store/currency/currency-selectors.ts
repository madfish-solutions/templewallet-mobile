import { useSelector } from 'react-redux';

import { CurrencyRootState, ExchangeRatesState } from './currency-state';

export const useExchangeRatesSelector = () =>
  useSelector<CurrencyRootState, ExchangeRatesState>(({ currency }) => currency);
