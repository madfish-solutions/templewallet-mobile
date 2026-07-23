export interface PartnersPromotionState {
  isEnabled: boolean;
  promotionHidingTimestamps: Record<string, number>;
}

export const partnersPromotionInitialState: PartnersPromotionState = {
  isEnabled: false,
  promotionHidingTimestamps: {}
};
