import { useSelector } from '../selector';

export const usePartnersPromoSelector = () => useSelector(state => state.partnersPromotion.promotion.data);
export const usePartnersPromoLoadingSelector = () => useSelector(state => state.partnersPromotion.promotion.isLoading);
export const useIsPartnersPromoEnabledSelector = () => useSelector(state => state.partnersPromotion.isEnabled);
