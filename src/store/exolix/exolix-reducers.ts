import { createReducer } from '@reduxjs/toolkit';

import {
  setExolixStepAction,
  loadExolixCurrenciesAction,
  loadExolixExchangeDataActions,
  restartExolixTopupAction
} from './exolix-actions';
import { exolixInitialState, ExolixState } from './exolix-state';

export const exolixReducers = createReducer<ExolixState>(exolixInitialState, builder => {
  builder.addCase(restartExolixTopupAction, () => exolixInitialState);

  builder.addCase(setExolixStepAction, (state, { payload: step }) => ({
    ...state,
    step
  }));

  builder.addCase(loadExolixCurrenciesAction.success, (state, { payload: currencies }) => ({
    ...state,
    currencies
  }));
  builder.addCase(loadExolixExchangeDataActions.success, (state, { payload: exchangeData }) => ({
    ...state,
    exchangeData
  }));
});
