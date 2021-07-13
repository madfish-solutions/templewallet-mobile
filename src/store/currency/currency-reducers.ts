import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';
import { loadExchangeRates } from './currency-actions';
import { currencyInitialState, tokenExchangeRatesState } from './currency-state';

export const currencyReducers = createReducer<tokenExchangeRatesState>(currencyInitialState, builder => {
  builder.addCase(loadExchangeRates.submit, state => ({
    ...state,
    tokenExchangeRates: createEntity([], true)
  }));
  builder.addCase(loadExchangeRates.success, (state, { payload }) => ({
    ...state,
    tokenExchangeRates: createEntity(payload)
  }));
  builder.addCase(loadExchangeRates.fail, (state, { payload }) => ({
    ...state,
    tokenExchangeRates: createEntity(state.tokenExchangeRates.data, false, payload)
  }));
});
