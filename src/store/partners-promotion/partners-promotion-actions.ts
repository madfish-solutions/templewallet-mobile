import { createAction } from '@reduxjs/toolkit';

import { OptimalPromotionAdType, OptimalPromotionType } from 'src/utils/optimal.utils';

import { createActions } from '../create-actions';

export const loadPartnersPromoActions = createActions<
  OptimalPromotionAdType,
  { adType: OptimalPromotionAdType; ad: OptimalPromotionType },
  { adType: OptimalPromotionAdType; error: string }
>('partnersPromo/LOAD_PARTNERS_PROMOTION');

export const togglePartnersPromotionAction = createAction<boolean>('partnersPromo/SET_IS_PROMOTION_ENABLED');
