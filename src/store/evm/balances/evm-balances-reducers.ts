import { createReducer } from '@reduxjs/toolkit';

import { processLoadedEvmBalancesAction } from './evm-balances-actions';
import { evmBalancesInitialState, EvmBalancesState } from './evm-balances-state';

export const evmBalancesReducers = createReducer<EvmBalancesState>(evmBalancesInitialState, builder => {
  builder.addCase(processLoadedEvmBalancesAction, (state, { payload }) => {
    const { account, chainId, balances, timestamp, preservedSlugs } = payload;

    if (!state.record[account]) {
      state.record[account] = {};
    }
    const accountRecord = state.record[account];

    const stored = accountRecord[chainId];
    if (stored && timestamp < stored.timestamp) {
      return;
    }

    const newBalances = { ...balances };
    if (stored && preservedSlugs) {
      for (const slug of preservedSlugs) {
        if (newBalances[slug] == null && stored.balances[slug] != null) {
          newBalances[slug] = stored.balances[slug];
        }
      }
    }

    accountRecord[chainId] = { balances: newBalances, timestamp };
  });
});
