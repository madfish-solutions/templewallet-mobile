import { createReducer } from '@reduxjs/toolkit';

import { CollectibleInterface } from '../../token/interfaces/collectible-interfaces.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { getCollectibleDetails } from '../../utils/collectibles.utils';
import { createEntity } from '../create-entity';
import { updateCollectibleDetailsAction, loadCollectiblesDetailsActions } from './collectibles-actions';
import { CollectiblesState, collectiblesInitialState } from './collectibles-state';

export const collectiblesReducers = createReducer<CollectiblesState>(collectiblesInitialState, builder => {
  builder.addCase(loadCollectiblesDetailsActions.success, (state, { payload: detailsFromObjkt }) => ({
    ...state,
    details: createEntity({
      ...state.details.data,
      ...detailsFromObjkt
    })
  }));
  builder.addCase(updateCollectibleDetailsAction.submit, state => {
    state.details.isLoading = true;
  });
  builder.addCase(updateCollectibleDetailsAction.success, (state, { payload }) => {
    const collectible: CollectibleInterface = JSON.parse(payload);
    const slug = getTokenSlug(collectible);

    return {
      ...state,
      details: createEntity(
        {
          ...state.details.data,
          [slug]: getCollectibleDetails(collectible)
        },
        false
      )
    };
  });
});
