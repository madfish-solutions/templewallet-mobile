import { createReducer } from '@reduxjs/toolkit';

import { emptyBaker } from '../../interfaces/baker.interface';
import { createEntity } from '../create-entity';
import { loadBakersListActions, loadSelectedBakerActions } from './baking-actions';
import { bakingInitialState, BakingState } from './baking-state';

export const bakingReducers = createReducer<BakingState>(bakingInitialState, builder => {
  builder.addCase(loadSelectedBakerActions.submit, state => ({
    ...state,
    selectedBaker: createEntity(state.selectedBaker.data, true)
  }));
  builder.addCase(loadSelectedBakerActions.success, (state, { payload: baker }) => ({
    ...state,
    selectedBaker: createEntity(baker, false)
  }));
  builder.addCase(loadSelectedBakerActions.fail, (state, { payload: error }) => ({
    ...state,
    selectedBaker: createEntity(emptyBaker, false, error)
  }));

  builder.addCase(loadBakersListActions.submit, state => ({
    ...state,
    bakersList: createEntity(state.bakersList.data, true)
  }));
  builder.addCase(loadBakersListActions.success, (state, { payload: bakersList }) => ({
    ...state,
    bakersList: createEntity(bakersList, false)
  }));
  builder.addCase(loadBakersListActions.fail, (state, { payload: error }) => ({
    ...state,
    bakersList: createEntity([], false, error)
  }));
});
