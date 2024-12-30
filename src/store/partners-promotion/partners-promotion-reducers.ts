import { createReducer } from '@reduxjs/toolkit';

import { AD_HIDING_TIMEOUT } from 'src/hooks/use-ad-temporary-hiding.hook';

import { hidePromotionAction, togglePartnersPromotionAction } from './partners-promotion-actions';
import { partnersPromotionInitialState } from './partners-promotion-state';

export const partnersPromotionReducers = createReducer(partnersPromotionInitialState, builder => {
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
