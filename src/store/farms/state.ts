import { FarmsSortFieldEnum } from 'src/enums/farms-sort-fields.enum';
import { SingleFarmResponse } from 'src/types/single-farm-response';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface UserStakeValueInterface {
  lastStakeId?: string;
  depositAmountAtomic?: string;
  claimableRewards?: string;
  fullReward?: string;
  rewardsDueDate?: number;
}

export type LastUserStakeInterface = Record<string, UserStakeValueInterface>;
export interface FarmsState {
  allFarms: LoadableEntityState<Array<SingleFarmResponse>>;
  lastStakes: LoadableEntityState<LastUserStakeInterface>;
  sortField: FarmsSortFieldEnum;
}

export const farmsInitialState: FarmsState = {
  lastStakes: createEntity({}),
  allFarms: createEntity([]),
  sortField: FarmsSortFieldEnum.Default
};
