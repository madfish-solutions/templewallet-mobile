import { createReducer } from '@reduxjs/toolkit';

import { isDefined } from 'src/utils/is-defined';

import { createEntity } from '../create-entity';

import {
  loadAllSavingsActions,
  loadAllSavingsAndStakesAction,
  loadAllStakesActions,
  loadSingleSavingStakeActions,
  selectSavingsSortValueAction
} from './actions';
import { savingsInitialState, SavingsState } from './state';

export const savingsReducer = createReducer<SavingsState>(savingsInitialState, builder => {
  builder.addCase(loadSingleSavingStakeActions.submit, (state, { payload }) => {
    const { item, accountPkh } = payload;

    if (!isDefined(state.stakes[accountPkh])) {
      state.stakes[accountPkh] = {};
    }

    const stakeState = state.stakes[accountPkh][item.contractAddress];

    state.stakes[accountPkh][item.contractAddress] = createEntity(
      stakeState?.data,
      true,
      undefined,
      stakeState?.wasLoading ?? false
    );
  });

  builder.addCase(loadSingleSavingStakeActions.success, (state, { payload }) => {
    const { stake, contractAddress, accountPkh } = payload;

    state.stakes[accountPkh][contractAddress] = createEntity(stake, false, undefined, true);
  });

  builder.addCase(loadSingleSavingStakeActions.fail, (state, { payload }) => {
    const { accountPkh, contractAddress, error } = payload;

    const stakeState = state.stakes[accountPkh][contractAddress];

    state.stakes[accountPkh][contractAddress] = createEntity(stakeState?.data, false, error, true);
  });

  builder.addCase(loadAllSavingsAndStakesAction, (state, { payload: accountPkh }) => {
    state.allSavingsItems = createEntity(state.allSavingsItems.data, true);

    if (!isDefined(state.stakes[accountPkh])) {
      state.stakes[accountPkh] = {};
    }

    state.stakes[accountPkh] = Object.fromEntries(
      state.allSavingsItems.data.map(({ contractAddress }) => {
        const stakeState = state.stakes[accountPkh]?.[contractAddress];

        return [contractAddress, createEntity(stakeState?.data, true, undefined, stakeState?.wasLoading ?? false)];
      })
    );
  });

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

  builder.addCase(loadAllStakesActions.success, (state, { payload }) => {
    const { accountPkh, stakes } = payload;

    if (!isDefined(state.stakes[accountPkh])) {
      state.stakes[accountPkh] = {};
    }

    const newStakes = Object.fromEntries(
      Object.entries(stakes).map(([itemAddress, newStakeState]) => [
        itemAddress,
        createEntity(newStakeState.data, false, newStakeState.error, true)
      ])
    );

    state.stakes[accountPkh] = newStakes;
  });

  builder.addCase(selectSavingsSortValueAction, (state, { payload }) => ({
    ...state,
    sortField: payload
  }));
});
