import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';
import { loadCollectiblesDetailsActions } from './collectibles-actions';
import { CollectiblesState, collectiblesInitialState } from './collectibles-state';

export const collectiblesReducers = createReducer<CollectiblesState>(collectiblesInitialState, builder => {
  builder.addCase(loadCollectiblesDetailsActions.submit, state => {
    state.details.isLoading = true;
  });

  builder.addCase(loadCollectiblesDetailsActions.success, (state, { payload }) => {
    state.details = createEntity(
      {
        ...state.details.data,
        ...payload
      },
      false
    );
  });

  builder.addCase(loadCollectiblesDetailsActions.fail, state => {
    state.details.isLoading = false;
  });
});
