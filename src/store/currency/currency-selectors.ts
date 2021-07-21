import { useSelector } from 'react-redux';

import { CurrencyRootState, ExchangeRatesState } from './currency-state';

export const useTokensExchangeRatesSelector = () =>
  useSelector<CurrencyRootState, ExchangeRatesState>(({ currency }) => currency);
