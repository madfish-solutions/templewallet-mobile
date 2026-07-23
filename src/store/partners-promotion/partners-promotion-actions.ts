import { createAction } from '@reduxjs/toolkit';

interface HidePromotionActionPayload {
  id: string;
  timestamp: number;
}

export const togglePartnersPromotionAction = createAction<boolean>('partnersPromo/SET_IS_PROMOTION_ENABLED');

export const hidePromotionAction = createAction<HidePromotionActionPayload>('partnersPromo/PROMOTION_HIDING');
