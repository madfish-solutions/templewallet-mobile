import { createReducer } from '@reduxjs/toolkit';

import { emptyTokenMetadata } from '../../token/interfaces/token-metadata.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { createEntity } from '../create-entity';
import { setNewTokensMetadata } from '../migration/migration-actions';
import { addTokensMetadataAction, loadTokenSuggestionActions, loadWhitelistAction } from './tokens-metadata-actions';
import { tokensMetadataInitialState, TokensMetadataState } from './tokens-metadata-state';

export const tokensMetadataReducers = createReducer<TokensMetadataState>(tokensMetadataInitialState, builder => {
  builder.addCase(addTokensMetadataAction, (state, { payload: tokensMetadata }) => {
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

  builder.addCase(loadWhitelistAction.success, (state, { payload: tokensMetadata }) => ({
    ...state,
    metadataRecord: tokensMetadata.reduce(
      (obj, tokenMetadata) => ({
        ...obj,
        [getTokenSlug(tokenMetadata)]: tokenMetadata
      }),
      state.metadataRecord
    )
  }));

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
});
