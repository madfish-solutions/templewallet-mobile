import { createReducer } from '@reduxjs/toolkit';
import { pickBy } from 'lodash-es';
import { persistReducer } from 'redux-persist';

import { isDefined } from 'src/utils/is-defined';
import { SlicedAsyncStorage } from 'src/utils/sliced-async-storage';

import {
  processLoadedEvmCollectiblesMetadataAction,
  putEvmCollectiblesMetadataAction
} from './evm-collectibles-metadata-actions';
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
          if (metadata[slug].metadataUri === null) {
            existing.metadataUri = null;
          }
        } else {
          chainRecord[slug] = metadata[slug];
        }
      }
    });

    builder.addCase(putEvmCollectiblesMetadataAction, (state, { payload }) => {
      const { chainId, metadata } = payload;

      state.record[chainId] = { ...state.record[chainId], ...metadata };
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
