import { useExchangeRatesSelector } from '../store/currency/currency-selectors';
import { TokenMetadataInterface } from '../token/interfaces/token-metadata.interface';
import { getTokenSlug } from '../token/utils/token.utils';

export const useTokenExchangeRate = (token: TokenMetadataInterface) => {
  const exchangeRates = useExchangeRatesSelector();

  return exchangeRates[getTokenSlug(token)];
};
