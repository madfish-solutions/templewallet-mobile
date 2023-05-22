import { FarmsListResponse, SingleFarmResponse } from 'src/apis/quipuswap-staking/types';

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
  farms: LoadableEntityState<FarmsListResponse>;
  allFarms: LoadableEntityState<Array<SingleFarmResponse>>;
  lastStakes: LastUserStakeInterface;
}

export const farmsInitialState: FarmsState = {
  farms: createEntity({ list: [] }),
  lastStakes: {},
  allFarms: createEntity([])
};

export interface FarmsRootState {
  farms: FarmsState;
}
