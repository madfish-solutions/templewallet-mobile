import { createReducer } from '@reduxjs/toolkit';
import { pickBy } from 'lodash-es';
import { persistReducer } from 'redux-persist';

import { isDefined } from 'src/utils/is-defined';
import { SlicedAsyncStorage } from 'src/utils/sliced-async-storage';

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
        const existing = chainRecord[slug];

        /* Defined fields of fresher metadata win, but sparser payloads (e.g. the on-chain builder,
           which carries no `iconURL`) must not erase fields the persisted entry already has */
        if (existing) {
          Object.assign(existing, pickBy(metadata[slug], isDefined));
        } else {
          chainRecord[slug] = metadata[slug];
        }
      }
    });
  }
);

export const evmTokensMetadataPersistedReducer = persistReducer(
  {
    key: 'root.evmTokensMetadata',
    storage: SlicedAsyncStorage
  },
  evmTokensMetadataReducers
);
