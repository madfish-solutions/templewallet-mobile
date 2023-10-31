import { OptimalPromotionAdType } from 'src/utils/optimal.utils';

import { useSelector } from '../selector';

export const usePartnersPromoSelector = (adType: OptimalPromotionAdType) =>
  useSelector(state =>
    adType === OptimalPromotionAdType.TwToken
      ? state.partnersPromotion.tokenPromotion.data
      : state.partnersPromotion.promotion.data
  );
export const usePartnersPromoLoadingSelector = () => useSelector(state => state.partnersPromotion.promotion.isLoading);
export const useIsPartnersPromoEnabledSelector = () => useSelector(state => state.partnersPromotion.isEnabled);
