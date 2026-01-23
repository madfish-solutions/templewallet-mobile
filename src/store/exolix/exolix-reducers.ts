import { createReducer } from '@reduxjs/toolkit';

import {
  setExolixStepAction,
  loadExolixCurrenciesAction,
  loadExolixExchangeDataActions,
  restartExolixTopupAction
} from './exolix-actions';
import { exolixInitialState, ExolixState } from './exolix-state';

export const exolixReducers = createReducer<ExolixState>(exolixInitialState, builder => {
  builder.addCase(restartExolixTopupAction, ({ currencies }) => ({
    ...exolixInitialState,
    currencies
  }));

  builder.addCase(setExolixStepAction, (state, { payload: step }) => ({
    ...state,
    step
  }));

  builder.addCase(loadExolixCurrenciesAction.submit, state => ({
    ...state,
    currenciesLoading: true
  }));
  builder.addCase(loadExolixCurrenciesAction.success, (state, { payload: currencies }) => ({
    ...state,
    currencies,
    currenciesLoading: false
  }));
  builder.addCase(loadExolixCurrenciesAction.fail, state => ({
    ...state,
    currenciesLoading: false
  }));

  builder.addCase(loadExolixExchangeDataActions.success, (state, { payload: exchangeData }) => ({
    ...state,
    exchangeData
  }));
});
