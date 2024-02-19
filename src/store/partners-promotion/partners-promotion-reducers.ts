import { createReducer } from '@reduxjs/toolkit';

import { AD_HIDING_TIMEOUT } from 'src/utils/optimal.utils';

import { createEntity } from '../create-entity';

import {
  hidePromotionAction,
  loadPartnersPromoActions,
  togglePartnersPromotionAction
} from './partners-promotion-actions';
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
  builder.addCase(togglePartnersPromotionAction, (state, { payload }) => ({
    ...state,
    isEnabled: payload,
    promotionHidingTimestamps: {}
  }));
  builder.addCase(hidePromotionAction, (state, { payload: { id: pathname, timestamp } }) => {
    const { promotionHidingTimestamps } = state;

    for (const promotionId in promotionHidingTimestamps) {
      if (promotionHidingTimestamps[promotionId] < timestamp - AD_HIDING_TIMEOUT * 2) {
        delete promotionHidingTimestamps[promotionId];
      }
    }

    promotionHidingTimestamps[pathname] = timestamp;
  });
});
