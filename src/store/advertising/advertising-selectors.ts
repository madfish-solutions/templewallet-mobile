import { useSelector } from 'react-redux';

import { AdvertisingPromotion } from '../../interfaces/advertising-promotion.interface';
import { AdvertisingRootState } from './advertising-state';

export const useActivePromotionSelector = () =>
  useSelector<AdvertisingRootState, AdvertisingPromotion | undefined>(
    ({ advertising }) => advertising.activePromotion.data
  );
