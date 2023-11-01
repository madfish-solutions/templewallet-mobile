import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';
import { setSelectedAccountAction } from '../wallet/wallet-actions';

import {
  loadAllSavingsActions,
  loadAllSavingsAndStakesAction,
  loadAllStakesActions,
  selectSavingsSortValueAction
} from './actions';
import { savingsInitialState, SavingsState } from './state';

export const savingsReducer = createReducer<SavingsState>(savingsInitialState, builder => {
  builder.addCase(loadAllSavingsAndStakesAction, state => ({
    ...state,
    allSavingsItems: createEntity(state.allSavingsItems.data, true),
    stakes: createEntity(state.stakes.data, true)
  }));
  builder.addCase(loadAllSavingsActions.submit, state => ({
    ...state,
    allSavingsItems: createEntity(state.allSavingsItems.data, true)
  }));
  builder.addCase(loadAllSavingsActions.success, (state, { payload }) => ({
    ...state,
    allSavingsItems: createEntity(payload, false)
  }));
  builder.addCase(loadAllSavingsActions.fail, (state, { payload }) => ({
    ...state,
    allSavingsItems: createEntity(state.allSavingsItems.data, false, payload)
  }));
  builder.addCase(loadAllStakesActions.success, (state, { payload }) => ({
    ...state,
    stakes: createEntity(payload, false)
  }));
  builder.addCase(setSelectedAccountAction, state => ({
    ...state,
    stakes: savingsInitialState.stakes
  }));
  builder.addCase(selectSavingsSortValueAction, (state, { payload }) => ({
    ...state,
    sortField: payload
  }));
});
