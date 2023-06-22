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
  selectSortValue
} from './actions';
import { farmsInitialState, FarmsState } from './state';

export const farmsReducer = createReducer<FarmsState>(farmsInitialState, builder => {
  builder.addCase(loadSingleFarmStakeActions.submit, state => ({
    ...state,
    stakesLoading: true
  }));
  builder.addCase(loadSingleFarmStakeActions.success, (state, { payload: { stake, farmAddress } }) => {
    const otherStakes = omit(state.lastStakes, farmAddress);

    return {
      ...state,
      lastStakes: isDefined(stake)
        ? {
            ...otherStakes,
            [farmAddress]: stake
          }
        : otherStakes,
      stakesLoading: false
    };
  });

  builder.addCase(loadAllFarmsAndStakesAction, state => ({
    ...state,
    allFarms: createEntity(state.allFarms.data, true),
    lastStakes: {},
    stakesLoading: true
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
    lastStakes: payload,
    stakesLoading: false
  }));
  builder.addCase(setSelectedAccountAction, state => ({
    ...state,
    lastStakes: farmsInitialState.lastStakes
  }));
  builder.addCase(selectSortValue, (state, { payload }) => ({
    ...state,
    sortField: payload
  }));
});
