import { createReducer } from '@reduxjs/toolkit';

import { isDefined } from 'src/utils/is-defined';

import { createEntity } from '../create-entity';
import {
  loadAllFarmsActions,
  loadAllFarmsAndStakesAction,
  loadAllStakesActions,
  loadSingleFarmStakeActions
} from './actions';
import { farmsInitialState, FarmsState } from './state';

export const farmsReducer = createReducer<FarmsState>(farmsInitialState, builder => {
  builder.addCase(loadSingleFarmStakeActions.success, (state, { payload: { stake, farmAddress } }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [farmAddress]: _, ...otherStakes } = state.lastStakes;

    return {
      ...state,
      lastStakes: isDefined(stake)
        ? {
            ...otherStakes,
            [farmAddress]: stake
          }
        : otherStakes
    };
  });

  builder.addCase(loadAllFarmsAndStakesAction, state => ({
    ...state,
    allFarms: createEntity(state.allFarms.data, true)
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
