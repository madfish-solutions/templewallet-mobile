import { createReducer } from '@reduxjs/toolkit';

import { SavingsProviderEnum } from 'src/enums/savings-provider.enum';
import { getStakeState, setStakeState } from 'src/utils/earn-opportunities/store.utils';

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

    const prevStakeState = getStakeState(state, accountPkh, item.contractAddress);
    setStakeState(state, accountPkh, item.contractAddress, createEntity(prevStakeState?.data, true));
  });

  builder.addCase(loadSingleSavingStakeActions.success, (state, { payload }) => {
    const { stake, contractAddress, accountPkh } = payload;

    setStakeState(state, accountPkh, contractAddress, createEntity(stake, false));
  });

  builder.addCase(loadSingleSavingStakeActions.fail, (state, { payload }) => {
    const { accountPkh, contractAddress, error } = payload;

    const prevStakeState = getStakeState(state, accountPkh, contractAddress);
    setStakeState(state, accountPkh, contractAddress, createEntity(prevStakeState?.data, false, error));
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

            return [contractAddress, createEntity(stakeState?.data, true)];
          })
        )
      );
    });
  });

  builder.addCase(loadSavingsByProviderActions.submit, (state, { payload: provider }) => {
    state.allSavingsItems[provider] = createEntity(state.allSavingsItems[provider].data, true);
  });
  builder.addCase(loadSavingsByProviderActions.success, (state, { payload }) => {
    state.allSavingsItems[payload.provider] = createEntity(payload.data, false);
  });
  builder.addCase(loadSavingsByProviderActions.fail, (state, { payload }) => {
    state.allSavingsItems[payload.provider] = createEntity(
      state.allSavingsItems[payload.provider].data,
      false,
      payload.error
    );
  });

  builder.addCase(loadAllStakesActions.success, (state, { payload }) => {
    const { accountPkh, stakes } = payload;
    const prevStakes = state.stakes[accountPkh] ?? {};

    state.stakes[accountPkh] = Object.fromEntries(
      Object.entries(stakes).map(([itemAddress, newStakeState]) => [
        itemAddress,
        createEntity(
          newStakeState.data === undefined ? prevStakes[itemAddress]?.data : newStakeState.data,
          false,
          newStakeState.error
        )
      ])
    );
  });

  builder.addCase(selectSavingsSortValueAction, (state, { payload }) => ({
    ...state,
    sortField: payload
  }));
});
