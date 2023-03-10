import { createAction } from '@reduxjs/toolkit';

import { OptimalPromotionInterface } from 'src/utils/optimal.utils';

import { createActions } from '../create-actions';

export const loadPartnersPromoActions = createActions<void, OptimalPromotionInterface, string>(
  'partnersPromo/LOAD_PARTNERS_PROMOTION'
);

export const skipPartnersPromotionAction = createAction<string>('partnersPromo/SKIP_PARTNERS_PROMOTION');
