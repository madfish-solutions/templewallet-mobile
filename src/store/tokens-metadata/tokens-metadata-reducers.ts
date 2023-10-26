import { createReducer } from '@reduxjs/toolkit';

import { emptyTokenMetadata } from 'src/token/interfaces/token-metadata.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';

import { createEntity } from '../create-entity';
import { setNewTokensMetadata } from '../migration/migration-actions';

import {
  addKnownSvg,
  addTokensMetadataAction,
  loadTokenSuggestionActions,
  loadWhitelistAction,
  removeKnownSvg
} from './tokens-metadata-actions';
import { tokensMetadataInitialState, TokensMetadataState } from './tokens-metadata-state';

export const tokensMetadataReducers = createReducer<TokensMetadataState>(tokensMetadataInitialState, builder => {
  builder.addCase(addTokensMetadataAction, (state, { payload: tokensMetadata }) => {
    if (tokensMetadata.length < 1) {
      return state;
    }

    const metadataRecord = tokensMetadata.reduce((prevState, tokenMetadata) => {
      const slug = getTokenSlug(tokenMetadata);

      return {
        ...prevState,
        [slug]: {
          ...prevState[slug],
          ...tokenMetadata
        }
      };
    }, state.metadataRecord);

    return {
      ...state,
      metadataRecord
    };
  });

  builder.addCase(loadWhitelistAction.success, (state, { payload: tokensMetadata }) => {
    const newMetadata = tokensMetadata.filter(metadata => {
      const slug = getTokenSlug(metadata);

      return !isDefined(state.metadataRecord[slug]);
    });

    if (newMetadata.length < 1) {
      return state;
    }

    return {
      ...state,
      metadataRecord: newMetadata.reduce(
        (obj, tokenMetadata) => ({
          ...obj,
          [getTokenSlug(tokenMetadata)]: tokenMetadata
        }),
        state.metadataRecord
      )
    };
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

  builder.addCase(addKnownSvg, (state, { payload: url }) => ({
    ...state,
    knownSvgs: {
      ...state.knownSvgs,
      [url]: true
    }
  }));
  builder.addCase(removeKnownSvg, (state, { payload: url }) => ({
    ...state,
    knownSvgs: {
      ...state.knownSvgs,
      [url]: false
    }
  }));

  // MIGRATIONS
  builder.addCase(setNewTokensMetadata, (state, { payload: metadataRecord }) => ({
    ...state,
    metadataRecord
  }));
});
