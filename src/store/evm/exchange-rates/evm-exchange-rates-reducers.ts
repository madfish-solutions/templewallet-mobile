import { createReducer } from '@reduxjs/toolkit';

import { processLoadedEvmExchangeRatesAction } from './evm-exchange-rates-actions';
import { evmExchangeRatesInitialState, EvmExchangeRatesState } from './evm-exchange-rates-state';

export const evmExchangeRatesReducers = createReducer<EvmExchangeRatesState>(evmExchangeRatesInitialState, builder => {
  builder.addCase(processLoadedEvmExchangeRatesAction, (state, { payload }) => {
    const { chainId, rates } = payload;

    if (!state.record[chainId]) {
      state.record[chainId] = {};
    }
    const chainRecord = state.record[chainId];

    for (const slug in rates) {
      chainRecord[slug] = rates[slug];
    }
  });
});
