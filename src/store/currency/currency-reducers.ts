import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';
import { loadExchangeRates } from './currency-actions';
import { currencyInitialState, CurrencyState } from './currency-state';

export const currencyReducers = createReducer<CurrencyState>(currencyInitialState, builder => {
  builder.addCase(loadExchangeRates.submit, state => ({
    ...state,
    exchangeRates: createEntity(state.exchangeRates.data, true),
    quotes: createEntity(state.quotes.data, true)
  }));
  builder.addCase(loadExchangeRates.success, (state, { payload }) => ({
    ...state,
    exchangeRates: createEntity(payload.exchangeRates),
    quotes: createEntity(payload.quotes)
  }));
  builder.addCase(loadExchangeRates.fail, (state, { payload }) => ({
    ...state,
    exchangeRates: createEntity(state.exchangeRates.data, false, payload),
    quotes: createEntity(state.quotes.data, false, payload)
  }));
});
