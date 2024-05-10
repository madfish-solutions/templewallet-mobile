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

            return [contractAddress, createEntity(stakeState?.data, true, undefined, stakeState?.wasLoading ?? false)];
          })
        )
      );
    });
  });

  builder.addCase(loadFarmsByProviderActions.submit, (state, { payload: provider }) => {
    const { data, wasLoading } = state.allFarms[provider];
    state.allFarms[provider] = createEntity(data, true, undefined, wasLoading ?? false);
  });
  builder.addCase(loadFarmsByProviderActions.success, (state, { payload }) => {
    state.allFarms[payload.provider] = createEntity(payload.data, false, undefined, true);
  });
  builder.addCase(loadFarmsByProviderActions.fail, (state, { payload }) => {
    state.allFarms[payload.provider] = createEntity(state.allFarms[payload.provider].data, false, payload.error, true);
  });

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
