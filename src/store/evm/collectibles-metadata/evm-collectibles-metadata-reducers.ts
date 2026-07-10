import { createReducer } from '@reduxjs/toolkit';

import { processLoadedEvmCollectiblesMetadataAction } from './evm-collectibles-metadata-actions';
import { evmCollectiblesMetadataInitialState, EvmCollectiblesMetadataState } from './evm-collectibles-metadata-state';

export const evmCollectiblesMetadataReducers = createReducer<EvmCollectiblesMetadataState>(
  evmCollectiblesMetadataInitialState,
  builder => {
    builder.addCase(processLoadedEvmCollectiblesMetadataAction, (state, { payload }) => {
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
