import { SingleFarmResponse } from 'src/apis/quipuswap/types';

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
}

export const farmsInitialState: FarmsState = {
  lastStakes: {},
  allFarms: createEntity([])
};

export interface FarmsRootState {
  farms: FarmsState;
}
