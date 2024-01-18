import { createReducer } from '@reduxjs/toolkit';
import { createMigrate, MigrationManifest, PersistedState, persistReducer } from 'redux-persist';

import { OVERRIDEN_MAINNET_TOKENS_METADATA } from 'src/token/data/tokens-metadata';
import { emptyTokenMetadata } from 'src/token/interfaces/token-metadata.interface';
import { getTokenSlug, toTokenSlug } from 'src/token/utils/token.utils';
import { SlicedAsyncStorage } from 'src/utils/sliced-async-storage';
import { transformWhitelistToTokenMetadata } from 'src/utils/token-metadata.utils';

import { createEntity } from '../create-entity';

import {
  addKnownSvg,
  putTokenMetadataAction,
  loadTokenSuggestionActions,
  loadTokensMetadataActions,
  loadWhitelistAction,
  removeKnownSvg
} from './tokens-metadata-actions';
import { tokensMetadataInitialState, TokensMetadataState } from './tokens-metadata-state';

type TypedPersistedState = Exclude<PersistedState, undefined> & TokensMetadataState;

const tokensMetadataReducers = createReducer<TokensMetadataState>(tokensMetadataInitialState, builder => {
  builder.addCase(loadTokensMetadataActions.submit, state => {
    state.isLoading = true;
  });

  builder.addCase(loadTokensMetadataActions.success, (state, { payload }) => {
    state.isLoading = false;

    for (const metadata of payload) {
      if (!metadata) {
        continue;
      }
      const slug = getTokenSlug(metadata);

      if (!state.metadataRecord[slug]) {
        state.metadataRecord[slug] = metadata;
      }
    }
  });

  builder.addCase(loadTokensMetadataActions.fail, state => {
    state.isLoading = false;
  });

  builder.addCase(putTokenMetadataAction, (state, { payload: metadata }) => {
    if (!metadata) {
      return state;
    }
    const slug = getTokenSlug(metadata);

    state.metadataRecord[slug] = Object.assign({}, state.metadataRecord[slug], metadata);
  });

  builder.addCase(loadWhitelistAction.success, (state, { payload }) => {
    for (const token of payload) {
      const slug = toTokenSlug(token.contractAddress, token.fa2TokenId);

      if (!state.metadataRecord[slug]) {
        state.metadataRecord[slug] = transformWhitelistToTokenMetadata(token);
      }
    }
  });

  builder.addCase(loadTokenSuggestionActions.submit, state => ({
    ...state,
    addTokenSuggestion: createEntity(emptyTokenMetadata, true)
  }));

  builder.addCase(loadTokenSuggestionActions.success, (state, { payload: tokenMetadata }) => ({
    ...state,
    addTokenSuggestion: createEntity(tokenMetadata, false)
  }));

  builder.addCase(loadTokenSuggestionActions.fail, (state, { payload: error }) => ({
    ...state,
    addTokenSuggestion: createEntity(emptyTokenMetadata, false, error)
  }));

  builder.addCase(addKnownSvg, (state, { payload: url }) => {
    state.knownSvgs[url] = true;
  });

  builder.addCase(removeKnownSvg, (state, { payload: url }) => {
    state.knownSvgs[url] = false;
  });
});

const MIGRATIONS: MigrationManifest = {
  '2': (untypedState: PersistedState): TypedPersistedState | undefined => {
    if (!untypedState) {
      return untypedState;
    }

    const state = untypedState as TypedPersistedState;

    for (const metadata of OVERRIDEN_MAINNET_TOKENS_METADATA) {
      const slug = getTokenSlug(metadata);
      state.metadataRecord[slug] = {
        ...(state.metadataRecord[slug] ?? {}),
        ...metadata
      };
    }

    return state;
  }
};

export const tokensMetadataPersistedReducers = persistReducer(
  {
    key: 'root.tokensMetadata',
    version: 2,
    storage: SlicedAsyncStorage,
    migrate: createMigrate(MIGRATIONS, { debug: __DEV__ }),
    blacklist: ['isLoading', 'addTokenSuggestion'] as (keyof TokensMetadataState)[]
  },
  tokensMetadataReducers
);
