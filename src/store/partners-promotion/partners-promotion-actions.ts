import { createAction } from '@reduxjs/toolkit';

interface HidePromotionActionPayload {
  id: string;
  timestamp: number;
}

export const togglePartnersPromotionAction = createAction<boolean>('partnersPromo/SET_IS_PROMOTION_ENABLED');
export const setHasSeenRewardsAnnouncementAction = createAction('partnersPromo/SET_HAS_SEEN_REWARDS_ANNOUNCEMENT');
export const setAdsEnabledEventSentAction = createAction('partnersPromo/SET_ADS_ENABLED_EVENT_SENT');

export const hidePromotionAction = createAction<HidePromotionActionPayload>('partnersPromo/PROMOTION_HIDING');
