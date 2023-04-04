import { createReducer } from '@reduxjs/toolkit';

import { loadCollectionsActions } from './collections-actions';
import { collectionsInitialState, CollectionState } from './collections-state';

export const collectionsReducer = createReducer<CollectionState>(collectionsInitialState, builder => {
  builder.addCase(loadCollectionsActions.success, (state, { payload: newCollections }) => {
    return {
      ...state,
      collectionInfo: [...newCollections]
    };
  });
});
