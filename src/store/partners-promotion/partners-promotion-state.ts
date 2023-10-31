import { createEntity } from 'src/store/create-entity';
import { OptimalPromotionType } from 'src/utils/optimal.utils';

import { LoadableEntityState } from '../types';
import { mockPartnersPromotion } from './partners-promotion-state.mock';

export interface PartnersPromotionState {
  textPromotion: LoadableEntityState<OptimalPromotionType>;
  promotion: LoadableEntityState<OptimalPromotionType>;
  isEnabled: boolean;
}

export const partnersPromotionInitialState: PartnersPromotionState = {
  textPromotion: createEntity(mockPartnersPromotion),
  promotion: createEntity(mockPartnersPromotion),
  isEnabled: false
};
