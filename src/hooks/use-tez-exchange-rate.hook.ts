import { TEZ_TOKEN_METADATA } from '../token/data/tokens-metadata';
import { useTokenExchangeRate } from './use-token-exchange-rate.hook';

export const useTezExchangeRate = () => useTokenExchangeRate(TEZ_TOKEN_METADATA);
