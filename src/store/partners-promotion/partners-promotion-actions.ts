import { createAction } from '@reduxjs/toolkit';

import { OptimalPromotionType } from 'src/utils/optimal.utils';

import { createActions } from '../create-actions';

export const loadPartnersPromoActions = createActions<undefined, OptimalPromotionType, string>(
  'partnersPromo/LOAD_PARTNERS_PROMOTION'
);

export const loadPartnersTextPromoActions = createActions<undefined, OptimalPromotionType, string>(
  'partnersPromo/LOAD_PARTNERS_TEXT_PROMOTION'
);

export const togglePartnersPromotionAction = createAction<boolean>('partnersPromo/SET_IS_PROMOTION_ENABLED');
