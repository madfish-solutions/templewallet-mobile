import { createEntity } from 'src/store/create-entity';
import { OptimalPromotionType } from 'src/utils/optimal.utils';

import { LoadableEntityState } from '../types';
import { mockPartnersPromotion } from './partners-promotion-state.mock';

export interface PartnersPromotionState {
  tokenPromotion: LoadableEntityState<OptimalPromotionType>;
  promotion: LoadableEntityState<OptimalPromotionType>;
  isEnabled: boolean;
}

export const partnersPromotionInitialState: PartnersPromotionState = {
  tokenPromotion: createEntity(mockPartnersPromotion),
  promotion: createEntity(mockPartnersPromotion),
  isEnabled: false
};
