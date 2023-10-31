import { createReducer } from '@reduxjs/toolkit';

import { OptimalPromotionAdType } from 'src/utils/optimal.utils';

import { createEntity } from '../create-entity';
import { loadPartnersPromoActions, togglePartnersPromotionAction } from './partners-promotion-actions';
import { partnersPromotionInitialState } from './partners-promotion-state';

export const partnersPromotionReducers = createReducer(partnersPromotionInitialState, builder => {
  builder.addCase(loadPartnersPromoActions.submit, (state, { payload: adType }) => {
    if (adType === OptimalPromotionAdType.TwToken) {
      return {
        ...state,
        tokenPromotion: createEntity(state.tokenPromotion.data, true)
      };
    }

    return {
      ...state,
      promotion: createEntity(state.promotion.data, true)
    };
  });
  builder.addCase(loadPartnersPromoActions.success, (state, { payload }) => {
    if (payload.adType === OptimalPromotionAdType.TwToken) {
      return {
        ...state,
        tokenPromotion: createEntity(payload.ad, false)
      };
    }

    return {
      ...state,
      promotion: createEntity(payload.ad, false)
    };
  });
  builder.addCase(loadPartnersPromoActions.fail, (state, { payload }) => {
    if (payload.adType === OptimalPromotionAdType.TwToken) {
      return {
        ...state,
        tokenPromotion: createEntity(state.tokenPromotion.data, false, payload.error)
      };
    }

    return {
      ...state,
      promotion: createEntity(state.promotion.data, false, payload.error)
    };
  });
  builder.addCase(togglePartnersPromotionAction, (state, { payload }) => ({
    ...state,
    isEnabled: payload
  }));
});
