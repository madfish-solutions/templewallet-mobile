import { createReducer } from '@reduxjs/toolkit';

import { loadCollectiblesDetailsActions } from './collectibles-actions';
import { CollectiblesState, collectiblesInitialState } from './collectibles-state';

export const collectiblesReducers = createReducer<CollectiblesState>(collectiblesInitialState, builder => {
  builder.addCase(loadCollectiblesDetailsActions.success, (state, { payload: detailsFromObjkt }) => ({
    ...state,
    details: {
      ...state.details,
      ...detailsFromObjkt
    }
  }));
});
