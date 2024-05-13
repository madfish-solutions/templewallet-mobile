import { createReducer } from '@reduxjs/toolkit';

import { FarmsProviderEnum } from 'src/enums/farms-provider.enum';
import { isDefined } from 'src/utils/is-defined';

import { createEntity } from '../create-entity';

import {
  loadFarmsByProviderActions,
  loadAllFarmsAndStakesAction,
  loadAllStakesActions,
  loadSingleFarmStakeActions,
  selectFarmsSortValueAction
} from './actions';
import { farmsInitialState, FarmsState } from './state';

export const farmsReducer = createReducer<FarmsState>(farmsInitialState, builder => {
  builder.addCase(loadSingleFarmStakeActions.submit, (state, { payload }) => {
    const { farm, accountPkh } = payload;
    const prevStakeState = state.lastStakes[accountPkh][farm.contractAddress];

    if (!isDefined(state.lastStakes[accountPkh])) {
      state.lastStakes[accountPkh] = {};
    }

    state.lastStakes[accountPkh][farm.contractAddress] = createEntity(prevStakeState?.data, true);
  });

  builder.addCase(loadSingleFarmStakeActions.success, (state, { payload }) => {
    const { stake, farmAddress, accountPkh } = payload;

    state.lastStakes[accountPkh][farmAddress] = createEntity(stake, false);
  });

  builder.addCase(loadSingleFarmStakeActions.fail, (state, { payload }) => {
    const { accountPkh, farmAddress, error } = payload;

    const stakeState = state.lastStakes[accountPkh][farmAddress];

    state.lastStakes[accountPkh][farmAddress] = createEntity(stakeState?.data, false, error);
  });

  builder.addCase(loadAllFarmsAndStakesAction, (state, { payload: accountPkh }) => {
    const previousStakes = state.lastStakes[accountPkh] ?? {};
    state.lastStakes[accountPkh] = {};

    Object.values(FarmsProviderEnum).forEach(provider => {
      const previousFarms = state.allFarms[provider];
      state.allFarms[provider] = createEntity(previousFarms.data, true);
      Object.assign(
        state.lastStakes[accountPkh],
        Object.fromEntries(
          previousFarms.data.map(({ item }) => {
            const { contractAddress } = item;
            const stakeState = previousStakes[contractAddress];

            return [contractAddress, createEntity(stakeState?.data, true)];
          })
        )
      );
    });
  });

  builder.addCase(loadFarmsByProviderActions.submit, (state, { payload: provider }) => {
    state.allFarms[provider] = createEntity(state.allFarms[provider].data, true);
  });
  builder.addCase(loadFarmsByProviderActions.success, (state, { payload }) => {
    state.allFarms[payload.provider] = createEntity(payload.data, false);
  });
  builder.addCase(loadFarmsByProviderActions.fail, (state, { payload }) => {
    state.allFarms[payload.provider] = createEntity(state.allFarms[payload.provider].data, false, payload.error);
  });

  builder.addCase(loadAllStakesActions.success, (state, { payload }) => {
    const { accountPkh, stakes } = payload;
    const prevStakes = state.lastStakes[accountPkh] ?? {};

    if (!isDefined(state.lastStakes[accountPkh])) {
      state.lastStakes[accountPkh] = {};
    }

    const newStakes = Object.fromEntries(
      Object.entries(stakes).map(([farmAddress, newStakeState]) => [
        farmAddress,
        createEntity(
          newStakeState.data === undefined ? prevStakes[farmAddress]?.data : newStakeState.data,
          false,
          newStakeState.error
        )
      ])
    );

    state.lastStakes[accountPkh] = newStakes;
  });

  builder.addCase(selectFarmsSortValueAction, (state, { payload }) => ({
    ...state,
    sortField: payload
  }));
});
