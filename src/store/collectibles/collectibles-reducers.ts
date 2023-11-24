import { createReducer } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';

import { createEntity } from '../create-entity';
import { SlicedAsyncStorage } from '../sliced-async-storage';

import { loadCollectiblesDetailsActions } from './collectibles-actions';
import { CollectiblesState, collectiblesInitialState } from './collectibles-state';

/** In seconds // TTL = Time To Live */
const ADULT_FLAG_TTL = 3 * 60 * 60;

const collectiblesReducer = createReducer<CollectiblesState>(collectiblesInitialState, builder => {
  builder.addCase(loadCollectiblesDetailsActions.submit, state => {
    state.details.isLoading = true;
  });

  builder.addCase(loadCollectiblesDetailsActions.success, (state, { payload }) => {
    const { details: detailsRecord, timestamp } = payload;

    const adultFlags = { ...state.adultFlags };
    const timestampInSeconds = Math.round(timestamp / 1_000);

    // Removing expired flags
    for (const [slug, { ts }] of Object.entries(adultFlags)) {
      if (ts + ADULT_FLAG_TTL < timestampInSeconds) delete adultFlags[slug];
    }

    for (const [slug, details] of Object.entries(detailsRecord)) {
      if (details) {
        adultFlags[slug] = { val: details.isAdultContent, ts: timestampInSeconds };
      }
    }

    state.details = createEntity(
      {
        ...state.details.data,
        ...detailsRecord
      },
      false
    );
    state.adultFlags = adultFlags;
  });

  builder.addCase(loadCollectiblesDetailsActions.fail, state => {
    state.details.isLoading = false;
  });
});

export const collectiblesPersistedReducer = persistReducer(
  {
    key: 'root.collectibles',
    storage: SlicedAsyncStorage
    // whitelist: ['adultFlags'] as (keyof CollectiblesState)[]
  },
  collectiblesReducer
);
