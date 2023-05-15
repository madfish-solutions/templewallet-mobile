import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';
import { loadAllFarmsActions, loadAllStakesActions, loadSingleFarmActions } from './actions';
import { farmsInitialState, FarmsState } from './state';

export const farmsReducer = createReducer<FarmsState>(farmsInitialState, builder => {
  builder.addCase(loadSingleFarmActions.submit, state => ({
    ...state,
    farms: createEntity(state.farms.data, true)
  }));

  builder.addCase(loadSingleFarmActions.success, (state, { payload: newItem }) => ({
    ...state,
    farms: createEntity({
      list: state.farms.data.list
        .filter(farm => farm.item.id !== newItem.item.id || farm.item.version === newItem.item.version)
        .concat(newItem)
    })
  }));

  builder.addCase(loadSingleFarmActions.fail, (state, { payload: error }) => ({
    ...state,
    farms: createEntity(state.farms.data, false, error)
  }));

  builder.addCase(loadAllFarmsActions.submit, state => ({
    ...state,
    allFarms: createEntity(state.allFarms.data, true)
  }));
  builder.addCase(loadAllFarmsActions.success, (state, { payload }) => ({
    ...state,
    allFarms: createEntity(payload, false)
  }));
  builder.addCase(loadAllFarmsActions.fail, (state, { payload }) => ({
    ...state,
    allFarms: createEntity(state.allFarms.data, false, payload)
  }));
  builder.addCase(loadAllStakesActions.success, (state, { payload }) => ({
    ...state,
    lastStakes: payload
  }));
});
