import { SingleFarmResponse } from 'src/apis/quipuswap-staking/types';
import { FarmsSortFieldEnum } from 'src/enums/farms-sort-fields.enum';

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
  lastStakes: LastUserStakeInterface;
  stakesLoading: boolean;
  sortField: FarmsSortFieldEnum;
}

export const farmsInitialState: FarmsState = {
  lastStakes: {},
  allFarms: createEntity([]),
  stakesLoading: false,
  sortField: FarmsSortFieldEnum.Default
};
