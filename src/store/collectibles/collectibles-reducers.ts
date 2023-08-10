import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';
import { loadCollectiblesDetailsActions, loadCollectibleDetailsActions } from './collectibles-actions';
import { CollectiblesState, collectiblesInitialState } from './collectibles-state';

export const collectiblesReducers = createReducer<CollectiblesState>(collectiblesInitialState, builder => {
  builder.addCase(loadCollectiblesDetailsActions.submit, state => {
    state.details.isLoading = true;
  });
  builder.addCase(loadCollectiblesDetailsActions.success, (state, { payload: detailsFromObjkt }) => ({
    ...state,
    details: createEntity(
      {
        ...state.details.data,
        ...detailsFromObjkt
      },
      false
    )
  }));
  builder.addCase(loadCollectiblesDetailsActions.fail, state => {
    state.details.isLoading = false;
  });

  builder.addCase(loadCollectibleDetailsActions.submit, state => {
    state.details.isLoading = true;
  });
  builder.addCase(loadCollectibleDetailsActions.success, (state, { payload }) => ({
    ...state,
    details: createEntity({
      ...state.details.data,
      ...payload
    })
  }));
  builder.addCase(loadCollectibleDetailsActions.fail, state => {
    state.details.isLoading = false;
  });
});
