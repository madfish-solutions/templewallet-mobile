export interface PartnersPromotionState {
  isEnabled: boolean;
  promotionHidingTimestamps: Record<string, number>;
  hasSeenRewardsAnnouncement: boolean;
  isAdsEnabledEventSent: boolean;
}

export const partnersPromotionInitialState: PartnersPromotionState = {
  isEnabled: true,
  promotionHidingTimestamps: {},
  hasSeenRewardsAnnouncement: false,
  isAdsEnabledEventSent: false
};
