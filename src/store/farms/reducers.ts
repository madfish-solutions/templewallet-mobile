import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';
import { setSelectedAccountAction } from '../wallet/wallet-actions';
import { loadSingleFarmActions, loadSingleFarmStakeActions } from './actions';
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
        .filter(farm => farm.item.id !== newItem.item.id || farm.item.version !== newItem.item.version)
        .concat(newItem)
    })
  }));

  builder.addCase(loadSingleFarmActions.fail, (state, { payload: error }) => ({
    ...state,
    farms: createEntity(state.farms.data, false, error)
  }));

  builder.addCase(loadSingleFarmStakeActions.submit, (state, { payload: { id, version } }) => ({
    ...state,
    lastStakes: {
      ...state.lastStakes,
      [version]: {
        ...state.lastStakes[version],
        [id]: createEntity(state.lastStakes[version][id]?.data, true)
      }
    }
  }));

  builder.addCase(loadSingleFarmStakeActions.success, (state, { payload: { stake, farm } }) => ({
    ...state,
    lastStakes: {
      ...state.lastStakes,
      [farm.version]: {
        ...state.lastStakes[farm.version],
        [farm.id]: createEntity(stake)
      }
    }
  }));

  builder.addCase(loadSingleFarmStakeActions.fail, (state, { payload: { farm, error } }) => ({
    ...state,
    lastStakes: {
      ...state.lastStakes,
      [farm.version]: {
        ...state.lastStakes[farm.version],
        [farm.id]: createEntity(state.lastStakes[farm.version][farm.id]?.data, false, error)
      }
    }
  }));

  builder.addCase(setSelectedAccountAction, state => ({
    ...state,
    lastStakes: farmsInitialState.lastStakes
  }));
});
