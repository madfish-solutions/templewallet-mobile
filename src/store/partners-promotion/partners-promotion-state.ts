import { OptimalPromotionInterface } from 'src/utils/optimal.utils';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';
import { mockPartnersPromotion } from './partners-promotion-state.mock';

export interface PartnersPromotionState {
  promotion: LoadableEntityState<OptimalPromotionInterface>;
  seenPromotionIds: Array<string>;
  isEnabled: boolean;
}

export const partnersPromotionInitialState: PartnersPromotionState = {
  promotion: createEntity(mockPartnersPromotion),
  seenPromotionIds: [],
  isEnabled: true
};

export interface PartnersPromotionRootState {
  partnersPromotion: PartnersPromotionState;
}
