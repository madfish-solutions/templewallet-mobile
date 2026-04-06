import { advertisingPromotionMock } from 'src/interfaces/advertising-promotion.mock';

import { createEntity } from '../create-entity';

import { AdvertisingState } from './advertising-state';

export const mockAdvertisingState: AdvertisingState = {
  activePromotion: createEntity(advertisingPromotionMock)
};
