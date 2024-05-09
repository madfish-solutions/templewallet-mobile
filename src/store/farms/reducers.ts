import { createReducer } from '@reduxjs/toolkit';

import { isDefined } from 'src/utils/is-defined';

import { createEntity } from '../create-entity';

import {
  loadAllFarmsActions,
  loadAllFarmsAndStakesAction,
  loadAllStakesActions,
  loadSingleFarmStakeActions,
  selectFarmsSortValueAction
} from './actions';
import { farmsInitialState, FarmsState } from './state';

export const farmsReducer = createReducer<FarmsState>(farmsInitialState, builder => {
  builder.addCase(loadSingleFarmStakeActions.submit, (state, { payload }) => {
    const { farm, accountPkh } = payload;

    if (!isDefined(state.lastStakes[accountPkh])) {
      state.lastStakes[accountPkh] = {};
    }

    const stakeState = state.lastStakes[accountPkh][farm.contractAddress];

    state.lastStakes[accountPkh][farm.contractAddress] = createEntity(
      stakeState?.data,
      true,
      undefined,
      stakeState?.wasLoading ?? false
    );
  });

  builder.addCase(loadSingleFarmStakeActions.success, (state, { payload }) => {
    const { stake, farmAddress, accountPkh } = payload;

    state.lastStakes[accountPkh][farmAddress] = createEntity(stake, false, undefined, true);
  });

  builder.addCase(loadSingleFarmStakeActions.fail, (state, { payload }) => {
    const { accountPkh, farmAddress, error } = payload;

    const stakeState = state.lastStakes[accountPkh][farmAddress];

    state.lastStakes[accountPkh][farmAddress] = createEntity(stakeState?.data, false, error, true);
  });

  builder.addCase(loadAllFarmsAndStakesAction, (state, { payload: accountPkh }) => {
    state.allFarms = createEntity(state.allFarms.data, true);

    if (!isDefined(state.lastStakes[accountPkh])) {
      state.lastStakes[accountPkh] = {};
    }

    state.lastStakes[accountPkh] = Object.fromEntries(
      state.allFarms.data.map(({ item }) => {
        const { contractAddress } = item;
        const stakeState = state.lastStakes[accountPkh]?.[contractAddress];

        return [contractAddress, createEntity(stakeState?.data, true, undefined, stakeState?.wasLoading)];
      })
    );
  });

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
    const { accountPkh, stakes } = payload;

    if (!isDefined(state.lastStakes[accountPkh])) {
      state.lastStakes[accountPkh] = {};
    }

    const newStakes = Object.fromEntries(
      Object.entries(stakes).map(([farmAddress, newStakeState]) => [
        farmAddress,
        createEntity(newStakeState.data, false, newStakeState.error, true)
      ])
    );

    state.lastStakes[accountPkh] = newStakes;
  });

  builder.addCase(selectFarmsSortValueAction, (state, { payload }) => ({
    ...state,
    sortField: payload
  }));
});
