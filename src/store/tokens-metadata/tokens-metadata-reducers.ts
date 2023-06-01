import { createReducer } from '@reduxjs/toolkit';

import { DEPRECATED_TKEY_METADATA } from 'src/token/data/tokens-metadata';
import { TokenMetadataInterface, emptyTokenMetadata } from 'src/token/interfaces/token-metadata.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';

import { createEntity } from '../create-entity';
import { setNewTokensMetadata, patchMetadataAction } from '../migration/migration-actions';
import { addTokensMetadataAction, loadTokenSuggestionActions, loadWhitelistAction } from './tokens-metadata-actions';
import { tokensMetadataInitialState, TokensMetadataState } from './tokens-metadata-state';

export const tokensMetadataReducers = createReducer<TokensMetadataState>(tokensMetadataInitialState, builder => {
  builder.addCase(addTokensMetadataAction, (state, { payload: tokensMetadata }) => {
    tokensMetadata = patchMetadata(tokensMetadata);

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

    tokensMetadata = patchMetadata(tokensMetadata);

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

  // MIGRATIONS
  builder.addCase(setNewTokensMetadata, (state, { payload: metadataRecord }) => ({
    ...state,
    metadataRecord
  }));
  builder.addCase(patchMetadataAction, state => {
    const slug = getTokenSlug(DEPRECATED_TKEY_METADATA);
    if (state.metadataRecord[slug]?.symbol !== DEPRECATED_TKEY_METADATA.symbol) {
      state.metadataRecord[slug] = DEPRECATED_TKEY_METADATA;
    }
  });
});

const patchMetadata = (tokensMetadata: TokenMetadataInterface[]) => {
  const slug = getTokenSlug(DEPRECATED_TKEY_METADATA);
  const index = tokensMetadata.findIndex(metadata => getTokenSlug(metadata) === slug);

  if (index < 0) {
    return tokensMetadata;
  }

  const newArray = [...tokensMetadata];
  newArray.splice(index, 1, DEPRECATED_TKEY_METADATA);

  return newArray;
};
