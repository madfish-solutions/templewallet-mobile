import { useSelector } from '../selector';

export const usePartnersPromoSelector = () => useSelector(state => state.partnersPromotion.promotion.data);
export const useSeenPartnersPromoIdsSelector = () =>
  useSelector(({ partnersPromotion }) => partnersPromotion.seenPromotionIds);
export const usePartnersPromoLoadingSelector = () => useSelector(state => state.partnersPromotion.promotion.isLoading);
