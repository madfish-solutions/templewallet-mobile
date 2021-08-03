import { useExchangeRatesSelector } from '../store/currency/currency-selectors';
import { TEZ_TOKEN_METADATA } from '../token/data/tokens-metadata';
import { TokenInterface } from '../token/interfaces/token.interface';
import { getTokenSlug } from '../token/utils/token.utils';

export const useTokenExchangeRate = (token: TokenInterface) => {
  const { exchangeRates } = useExchangeRatesSelector();
  const exchangeRateKey = token.symbol === TEZ_TOKEN_METADATA.symbol ? TEZ_TOKEN_METADATA.name : getTokenSlug(token);

  return exchangeRates.data[exchangeRateKey];
};
