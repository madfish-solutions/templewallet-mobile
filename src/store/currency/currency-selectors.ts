import { useSelector } from 'react-redux';

import { CurrencyRootState, tokenExchangeRatesState } from './currency-state';

export const useTokenExchangeRatesSelector = () =>
  useSelector<CurrencyRootState, tokenExchangeRatesState>(({ currency }) => currency);

export const useDollarCurrency = (address: string, balance: string) => {
  const { data } = useTokenExchangeRatesSelector().tokenExchangeRates;
  const test = data.map(item => {
    if (item.tokenAddress === address) {
      return Number.parseInt(item.exchangeRate, 10) * Number.parseInt(balance, 10);
    }
  });
};
