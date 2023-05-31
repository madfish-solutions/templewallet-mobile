import { AdvertisingPromotion } from '../../interfaces/advertising-promotion.interface';
import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface AdvertisingState {
  activePromotion: LoadableEntityState<AdvertisingPromotion | undefined>;
}

export const advertisingInitialState: AdvertisingState = {
  activePromotion: createEntity(undefined)
};
