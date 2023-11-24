import { createReducer } from '@reduxjs/toolkit';

import { loadCollectionsActions } from './collections-actions';
import { Collection, collectionsInitialState, CollectionState } from './collections-state';

export const collectionsReducer = createReducer<CollectionState>(collectionsInitialState, builder => {
  builder.addCase(loadCollectionsActions.success, (state, { payload: newCollections }) => {
    const result = newCollections.reduce<Record<string, Collection[]>>((acc, current) => {
      if (acc[current.creator] !== undefined) {
        acc[current.creator] = [...acc[current.creator], { ...current }];
      } else {
        acc[current.creator] = [{ ...current }];
      }

      return acc;
    }, {});

    return {
      ...state,
      created: { ...state.created, ...result }
    };
  });
});
