import { createReducer } from '@reduxjs/toolkit';
import { original } from 'immer';
import { persistReducer } from 'redux-persist';

import { SlicedAsyncStorage } from 'src/utils/sliced-async-storage';

import { createEntity } from '../create-entity';
import { setSelectedAccountAction } from '../wallet/wallet-actions';

import { loadCollectiblesDetailsActions, loadOneCollectibleDetailsActions } from './collectibles-actions';
import { CollectiblesState, collectiblesInitialState } from './collectibles-state';

/** In seconds // TTL = Time To Live */
const ADULT_FLAG_TTL = 3 * 60 * 60;

const hasInFlightCollectiblesDetails = (inFlight: Record<string, true>) => Object.keys(inFlight).length > 0;

const cloneInFlightRecord = (inFlight: Record<string, true>): Record<string, true> => {
  const next: Record<string, true> = Object.create(null);

  for (const slug in inFlight) {
    next[slug] = true;
  }

  return next;
};

const collectiblesReducer = createReducer<CollectiblesState>(collectiblesInitialState, builder => {
  builder.addCase(loadCollectiblesDetailsActions.submit, (state, { payload }) => {
    state.details.isLoading = true;

    const inFlight = cloneInFlightRecord(original(state.collectiblesDetailsInFlight) ?? {});

    for (const collectiblesSlug of payload) {
      inFlight[collectiblesSlug] = true;
    }

    state.collectiblesDetailsInFlight = inFlight;
  });

  builder.addCase(loadCollectiblesDetailsActions.success, (state, { payload }) => {
    const { details: detailsRecord, timestamp } = payload;

    const adultFlags = { ...state.adultFlags };
    const timestampInSeconds = Math.round(timestamp / 1_000);

    // Removing expired flags
    for (const [slug, { ts }] of Object.entries(adultFlags)) {
      if (ts + ADULT_FLAG_TTL < timestampInSeconds) {
        delete adultFlags[slug];
      }
    }

    for (const [slug, details] of Object.entries(detailsRecord)) {
      if (details) {
        adultFlags[slug] = { val: details.isAdultContent, ts: timestampInSeconds };
      }
      delete state.collectiblesDetailsInFlight[slug];
    }

    state.details = createEntity(
      {
        ...state.details.data,
        ...detailsRecord
      },
      hasInFlightCollectiblesDetails(state.collectiblesDetailsInFlight)
    );
    state.adultFlags = adultFlags;
  });

  builder.addCase(loadCollectiblesDetailsActions.fail, (state, { payload }) => {
    payload.slugs.forEach(collectiblesSlug => {
      delete state.collectiblesDetailsInFlight[collectiblesSlug];
    });
    state.details.isLoading = hasInFlightCollectiblesDetails(state.collectiblesDetailsInFlight);
  });

  builder.addCase(setSelectedAccountAction, state => {
    state.details.isLoading = false;
    state.collectiblesDetailsInFlight = {};
  });

  builder.addCase(loadOneCollectibleDetailsActions.submit, state => {
    state.singleCollectibleLoading = true;
  });

  builder.addCase(loadOneCollectibleDetailsActions.success, (state, { payload }) => {
    const { slug, details, timestamp } = payload;
    state.singleCollectibleLoading = false;
    const timestampInSeconds = Math.round(timestamp / 1_000);

    if (!details) {
      state.details.data[slug] = null;

      return;
    }

    state.adultFlags[slug] = { val: details.isAdultContent, ts: timestampInSeconds };
    state.details.data[slug] = details;
    state.singleCollectibleLoading = false;
  });

  builder.addCase(loadOneCollectibleDetailsActions.fail, state => {
    state.singleCollectibleLoading = false;
  });
});

export const collectiblesPersistedReducer = persistReducer(
  {
    key: 'root.collectibles',
    storage: SlicedAsyncStorage,
    whitelist: ['adultFlags'] as (keyof CollectiblesState)[]
  },
  collectiblesReducer
);
