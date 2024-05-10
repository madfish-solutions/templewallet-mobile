import { createReducer } from '@reduxjs/toolkit';

import { SavingsProviderEnum } from 'src/enums/savings-provider.enum';
import { isDefined } from 'src/utils/is-defined';

import { createEntity } from '../create-entity';

import {
  loadAllSavingsAndStakesAction,
  loadAllStakesActions,
  loadSavingsByProviderActions,
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
    const previousStakes = state.stakes[accountPkh] ?? {};
    state.stakes[accountPkh] = {};

    Object.values(SavingsProviderEnum).forEach(provider => {
      const previousSavingsItems = state.allSavingsItems[provider];
      state.allSavingsItems[provider] = createEntity(previousSavingsItems.data, true);
      Object.assign(
        state.stakes[accountPkh],
        Object.fromEntries(
          previousSavingsItems.data.map(({ contractAddress }) => {
            const stakeState = previousStakes[contractAddress];

            return [contractAddress, createEntity(stakeState?.data, true, undefined, stakeState?.wasLoading ?? false)];
          })
        )
      );
    });
  });

  builder.addCase(loadSavingsByProviderActions.submit, (state, { payload: provider }) => {
    const { data, wasLoading } = state.allSavingsItems[provider];
    state.allSavingsItems[provider] = createEntity(data, true, undefined, wasLoading ?? false);
  });
  builder.addCase(loadSavingsByProviderActions.success, (state, { payload }) => {
    state.allSavingsItems[payload.provider] = createEntity(payload.data, false, undefined, true);
  });
  builder.addCase(loadSavingsByProviderActions.fail, (state, { payload }) => {
    state.allSavingsItems[payload.provider] = createEntity(
      state.allSavingsItems[payload.provider].data,
      false,
      payload.error,
      true
    );
  });

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
