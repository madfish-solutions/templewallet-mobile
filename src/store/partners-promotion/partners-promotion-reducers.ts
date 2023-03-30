import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';
import { loadPartnersPromoActions, setIsPromotionEnabledAction } from './partners-promotion-actions';
import { partnersPromotionInitialState } from './partners-promotion-state';

export const partnersPromotionReducers = createReducer(partnersPromotionInitialState, builder => {
  builder.addCase(loadPartnersPromoActions.submit, state => ({
    ...state,
    promotion: createEntity(state.promotion.data, true)
  }));
  builder.addCase(loadPartnersPromoActions.success, (state, { payload }) => ({
    ...state,
    promotion: createEntity(payload, false)
  }));
  builder.addCase(loadPartnersPromoActions.fail, (state, { payload }) => ({
    ...state,
    promotion: createEntity(state.promotion.data, false, payload)
  }));
  builder.addCase(setIsPromotionEnabledAction, (state, { payload }) => ({
    ...state,
    isEnabled: payload
  }));
});
