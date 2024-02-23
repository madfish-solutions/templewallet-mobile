import { EarnOpportunitiesSortFieldEnum } from 'src/enums/earn-opportunities-sort-fields.enum';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { SingleFarmResponse } from 'src/types/single-farm-response';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export type LastUserStakeInterface = Record<string, UserStakeValueInterface>;
export interface FarmsState {
  lastStakes: LoadableEntityState<LastUserStakeInterface>;
  allFarms: LoadableEntityState<Array<SingleFarmResponse>>;
  sortField: EarnOpportunitiesSortFieldEnum;
}

export const farmsInitialState: FarmsState = {
  lastStakes: createEntity({}),
  allFarms: createEntity([]),
  sortField: EarnOpportunitiesSortFieldEnum.Default
};
