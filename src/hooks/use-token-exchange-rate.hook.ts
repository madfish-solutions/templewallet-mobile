import { useExchangeRatesSelector } from '../store/currency/currency-selectors';
import { AssetMetadataInterface } from '../token/interfaces/token-metadata.interface';
import { getExchangeRateKey } from '../utils/exchange-rate.utils';

export const useTokenExchangeRate = (token: AssetMetadataInterface) => {
  const { exchangeRates } = useExchangeRatesSelector();

  return exchangeRates.data[getExchangeRateKey(token)];
};
