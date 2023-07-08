import { createReducer } from '@reduxjs/toolkit';
import { omit } from 'lodash-es';

import { isDefined } from 'src/utils/is-defined';

import { createEntity } from '../create-entity';
import { setSelectedAccountAction } from '../wallet/wallet-actions';
import {
  loadAllFarmsActions,
  loadAllFarmsAndStakesAction,
  loadAllStakesActions,
  loadSingleFarmStakeActions,
  selectSortValueAction
} from './actions';
import { farmsInitialState, FarmsState, LastUserStakeInterface } from './state';

export const farmsReducer = createReducer<FarmsState>(farmsInitialState, builder => {
  builder.addCase(loadSingleFarmStakeActions.submit, state => ({
    ...state,
    lastStakes: createEntity(state.lastStakes.data, true)
  }));
  builder.addCase(loadSingleFarmStakeActions.success, (state, { payload: { stake, farmAddress } }) => {
    const currentStakes = state.lastStakes.data;

    const lastStakes = isDefined(stake)
      ? {
          ...currentStakes,
          [farmAddress]: stake
        }
      : omit(currentStakes, farmAddress);

    return {
      ...state,
      lastStakes: createEntity(lastStakes)
    };
  });
  builder.addCase(loadSingleFarmStakeActions.fail, (state, { payload }) => {
    return {
      ...state,
      lastStakes: createEntity(state.lastStakes.data, false, payload.error)
    };
  });
  builder.addCase(loadAllFarmsAndStakesAction, state => ({
    ...state,
    allFarms: createEntity(state.allFarms.data, true),
    lastStakes: createEntity(state.lastStakes.data, true)
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
  builder.addCase(loadAllStakesActions.success, (state, { payload }) => {
    const newStakes = Object.entries(payload).reduce<LastUserStakeInterface>((acc, [farmAddress, stake]) => {
      switch (stake) {
        case undefined:
          acc[farmAddress] = state.lastStakes.data[farmAddress];
          break;
        case null:
          break;
        default:
          acc[farmAddress] = stake;
      }

      return acc;
    }, {});

    return {
      ...state,
      lastStakes: createEntity(newStakes)
    };
  });
  builder.addCase(setSelectedAccountAction, state => ({
    ...state,
    lastStakes: farmsInitialState.lastStakes
  }));
  builder.addCase(selectSortValueAction, (state, { payload }) => ({
    ...state,
    sortField: payload
  }));
});
