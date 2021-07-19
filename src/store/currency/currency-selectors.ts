import { useSelector } from 'react-redux';

import { CurrencyRootState, exchangeRatesState } from './currency-state';

export const useTokensExchangeRatesSelector = () =>
  useSelector<CurrencyRootState, exchangeRatesState>(({ currency }) => currency);
