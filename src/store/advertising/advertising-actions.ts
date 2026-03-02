import { AdvertisingPromotion } from 'src/interfaces/advertising-promotion.interface';

import { createActions } from '../create-actions';

export const loadAdvertisingPromotionActions = createActions<void, AdvertisingPromotion | undefined, string>(
  'advertising/LOAD_PROMOTION'
);
