import { createReducer } from '@reduxjs/toolkit';

import { processLoadedEvmTokensMetadataAction } from './evm-tokens-metadata-actions';
import { evmTokensMetadataInitialState, EvmTokensMetadataState } from './evm-tokens-metadata-state';

export const evmTokensMetadataReducers = createReducer<EvmTokensMetadataState>(
  evmTokensMetadataInitialState,
  builder => {
    builder.addCase(processLoadedEvmTokensMetadataAction, (state, { payload }) => {
      const { chainId, metadata } = payload;

      if (!state.record[chainId]) {
        state.record[chainId] = {};
      }
      const chainRecord = state.record[chainId];

      for (const slug in metadata) {
        chainRecord[slug] = metadata[slug];
      }
    });
  }
);
