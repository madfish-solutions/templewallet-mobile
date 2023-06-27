import { OptimalPromotionType } from 'src/utils/optimal.utils';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';
import { mockPartnersPromotion } from './partners-promotion-state.mock';

export interface PartnersPromotionState {
  promotion: LoadableEntityState<OptimalPromotionType>;
  isEnabled: boolean;
}

export const partnersPromotionInitialState: PartnersPromotionState = {
  promotion: createEntity(mockPartnersPromotion),
  isEnabled: false
};

export interface PartnersPromotionRootState {
  partnersPromotion: PartnersPromotionState;
}
