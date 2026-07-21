import { useSelector } from '../selector';

export const useIsPartnersPromoEnabledSelector = () => useSelector(state => state.partnersPromotion.isEnabled);
export const usePromotionHidingTimestampSelector = (id: string) =>
  useSelector(({ partnersPromotion }) => partnersPromotion.promotionHidingTimestamps[id] ?? 0);
export const useHasSeenRewardsAnnouncementSelector = () =>
  useSelector(({ partnersPromotion }) => partnersPromotion.hasSeenRewardsAnnouncement);
export const useIsAdsEnabledEventSentSelector = () =>
  useSelector(({ partnersPromotion }) => partnersPromotion.isAdsEnabledEventSent);
