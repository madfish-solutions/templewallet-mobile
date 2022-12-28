import { useSelector } from '../selector';

export const useActivePromotionSelector = () => useSelector(({ advertising }) => advertising.activePromotion.data);
