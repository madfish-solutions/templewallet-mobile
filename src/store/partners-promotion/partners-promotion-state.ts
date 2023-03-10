import { OptimalPromotionInterface } from 'src/utils/optimal.utils';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';
import { mockPartnersPromotion } from './partners-promotion-state.mock';

export interface PartnersPromotionState {
  promotion: LoadableEntityState<OptimalPromotionInterface>;
  seenPromotionIds: Array<string>;
}

export const partnersPromotionInitialState: PartnersPromotionState = {
  promotion: createEntity(mockPartnersPromotion),
  seenPromotionIds: []
};

export interface PartnersPromotionRootState {
  partnersPromotion: PartnersPromotionState;
}
