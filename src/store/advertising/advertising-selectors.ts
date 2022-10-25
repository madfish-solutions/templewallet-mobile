import { useSelector } from 'react-redux';

import { AdvertisingRootState, AdvertisingState } from './advertising-state';

export const useActivePromotionSelector = () =>
  useSelector<AdvertisingRootState, AdvertisingState['activePromotion']>(
    ({ advertising }) => advertising.activePromotion
  );
