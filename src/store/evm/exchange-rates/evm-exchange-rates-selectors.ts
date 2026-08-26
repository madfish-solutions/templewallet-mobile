import { useSelector } from '../../selector';

const EMPTY_EVM_CHAIN_EXCHANGE_RATES_RECORD: Record<string, number> = {};

export const useEvmChainExchangeRatesSelector = (chainId: number): Record<string, number> =>
  useSelector(({ evmExchangeRates }) => evmExchangeRates.record[chainId]) ?? EMPTY_EVM_CHAIN_EXCHANGE_RATES_RECORD;
