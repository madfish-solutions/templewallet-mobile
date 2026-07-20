import { createReducer } from '@reduxjs/toolkit';
import { pickBy } from 'lodash-es';
import { persistReducer } from 'redux-persist';

import { isDefined } from 'src/utils/is-defined';
import { SlicedAsyncStorage } from 'src/utils/sliced-async-storage';

import { processLoadedEvmCollectiblesMetadataAction } from './evm-collectibles-metadata-actions';
import { evmCollectiblesMetadataInitialState, EvmCollectiblesMetadataState } from './evm-collectibles-metadata-state';

const evmCollectiblesMetadataReducers = createReducer<EvmCollectiblesMetadataState>(
  evmCollectiblesMetadataInitialState,
  builder => {
    builder.addCase(processLoadedEvmCollectiblesMetadataAction, (state, { payload }) => {
      const { chainId, metadata } = payload;

      if (!state.record[chainId]) {
        state.record[chainId] = {};
      }
      const chainRecord = state.record[chainId];

      for (const slug in metadata) {
        const existing = chainRecord[slug];

        if (existing) {
          Object.assign(existing, pickBy(metadata[slug], isDefined));
        } else {
          chainRecord[slug] = metadata[slug];
        }
      }
    });
  }
);

export const evmCollectiblesMetadataPersistedReducer = persistReducer(
  {
    key: 'root.evmCollectiblesMetadata',
    storage: SlicedAsyncStorage
  },
  evmCollectiblesMetadataReducers
);
