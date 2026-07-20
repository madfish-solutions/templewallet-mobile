import { createReducer } from '@reduxjs/toolkit';

import { processLoadedEvmBalancesAction, processLoadedOnChainEvmBalancesAction } from './evm-balances-actions';
import { evmBalancesInitialState, EvmBalancesState, EvmChainBalancesRecord } from './evm-balances-state';

const getChainBalancesRecord = (
  state: EvmBalancesState,
  account: HexString,
  chainId: number
): EvmChainBalancesRecord => {
  if (!state.record[account]) {
    state.record[account] = {};
  }
  if (!state.record[account][chainId]) {
    state.record[account][chainId] = {};
  }

  return state.record[account][chainId];
};

const setChainTimestamp = (state: EvmBalancesState, account: HexString, chainId: number, timestamp: number) => {
  if (!state.timestamps[account]) {
    state.timestamps[account] = {};
  }
  state.timestamps[account][chainId] = timestamp;
};

export const evmBalancesReducers = createReducer<EvmBalancesState>(evmBalancesInitialState, builder => {
  builder.addCase(processLoadedEvmBalancesAction, (state, { payload }) => {
    const { account, chainId, balances, timestamp, preservedSlugs } = payload;

    const storedTimestamp = state.timestamps[account]?.[chainId];
    if (storedTimestamp != null && timestamp < storedTimestamp) {
      return;
    }

    const stored = state.record[account]?.[chainId];

    const newBalances = { ...balances };
    if (stored && preservedSlugs) {
      for (const slug of preservedSlugs) {
        if (newBalances[slug] == null && stored[slug] != null) {
          newBalances[slug] = stored[slug];
        }
      }
    }

    if (!state.record[account]) {
      state.record[account] = {};
    }
    state.record[account][chainId] = newBalances;
    setChainTimestamp(state, account, chainId, timestamp);
  });

  builder.addCase(processLoadedOnChainEvmBalancesAction, (state, { payload }) => {
    const { account, chainId, balances, timestamp } = payload;

    const storedTimestamp = state.timestamps[account]?.[chainId];
    if (storedTimestamp != null && timestamp < storedTimestamp) {
      return;
    }

    const chainRecord = getChainBalancesRecord(state, account, chainId);
    for (const slug in balances) {
      chainRecord[slug] = balances[slug];
    }
    setChainTimestamp(state, account, chainId, timestamp);
  });
});
