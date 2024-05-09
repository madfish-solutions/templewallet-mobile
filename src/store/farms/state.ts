import { EarnOpportunitiesSortFieldEnum } from 'src/enums/earn-opportunities-sort-fields.enum';
import { UserEarnOpportunitiesStakes } from 'src/types/earn-opportunity.types';
import { SingleFarmResponse } from 'src/types/single-farm-response';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface FarmsState {
  lastStakes: Record<string, UserEarnOpportunitiesStakes>;
  allFarms: LoadableEntityState<Array<SingleFarmResponse>>;
  sortField: EarnOpportunitiesSortFieldEnum;
}

export const farmsInitialState: FarmsState = {
  lastStakes: {},
  allFarms: createEntity([]),
  sortField: EarnOpportunitiesSortFieldEnum.Default
};
