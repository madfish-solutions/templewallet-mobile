import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';

import { loadAdvertisingPromotionActions } from './advertising-actions';
import { advertisingInitialState, AdvertisingState } from './advertising-state';

export const advertisingReducers = createReducer<AdvertisingState>(advertisingInitialState, builder => {
  builder.addCase(loadAdvertisingPromotionActions.submit, state => ({
    ...state,
    activePromotion: createEntity(state.activePromotion.data, true)
  }));
  builder.addCase(loadAdvertisingPromotionActions.success, (state, { payload: activePromotion }) => ({
    ...state,
    activePromotion: createEntity(activePromotion, false)
  }));
  builder.addCase(loadAdvertisingPromotionActions.fail, (state, { payload: error }) => ({
    ...state,
    activePromotion: createEntity(state.activePromotion.data, false, error)
  }));
});
