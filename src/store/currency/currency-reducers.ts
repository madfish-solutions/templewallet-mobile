import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';
import { loadExchangeRates, loadTezosExchangeRate } from './currency-actions';
import { currencyInitialState, exchangeRatesState } from './currency-state';

export const currencyReducers = createReducer<exchangeRatesState>(currencyInitialState, builder => {
  builder.addCase(loadExchangeRates.submit, state => ({
    ...state,
    tokensExchangeRates: createEntity({}, true)
  }));
  builder.addCase(loadExchangeRates.success, (state, { payload }) => ({
    ...state,
    tokensExchangeRates: createEntity(payload)
  }));
  builder.addCase(loadExchangeRates.fail, (state, { payload }) => ({
    ...state,
    tokensExchangeRates: createEntity(state.tokensExchangeRates.data || null, false, payload)
  }));
  builder.addCase(loadTezosExchangeRate.submit, state => ({
    ...state,
    tezosExchangeRate: createEntity(0, true)
  }));
  builder.addCase(loadTezosExchangeRate.success, (state, { payload }) => ({
    ...state,
    tezosExchangeRate: createEntity(payload)
  }));
  builder.addCase(loadTezosExchangeRate.fail, (state, { payload }) => ({
    ...state,
    tezosExchangeRate: createEntity(state.tezosExchangeRate.data, false, payload)
  }));
});
