import { AdvertisingPromotion } from '../../interfaces/advertising-promotion.interface';
import { createActions } from '../create-actions';

export const loadAdvertisingPromotionActions = createActions<void, AdvertisingPromotion, string>(
  'advertising/LOAD_PROMOTION'
);
