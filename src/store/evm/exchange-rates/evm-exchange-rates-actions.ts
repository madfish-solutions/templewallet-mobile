import { createAction } from '@reduxjs/toolkit';

interface ProcessLoadedEvmExchangeRatesActionPayload {
  chainId: number;
  rates: Record<string, number>;
}

export const processLoadedEvmExchangeRatesAction = createAction<ProcessLoadedEvmExchangeRatesActionPayload>(
  'evm/exchange-rates/PROCESS_LOADED_EVM_EXCHANGE_RATES'
);
