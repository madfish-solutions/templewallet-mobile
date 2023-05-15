import { FarmsListResponse, FarmVersionEnum, SingleFarmResponse, V3FarmStake } from 'src/apis/quipuswap-staking/types';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface UserStakeValueInterface {
  lastStakeId?: string;
  depositAmountAtomic?: string;
  claimableRewards?: string;
  fullReward?: string;
}

export type LastUserStakeInterface = Record<string, UserStakeValueInterface>;
export interface FarmsState {
  farms: LoadableEntityState<FarmsListResponse>;
  allFarms: LoadableEntityState<Array<SingleFarmResponse>>;
  lastStakes: Record<FarmVersionEnum, Record<string, LoadableEntityState<V3FarmStake>>>;
  lastStakes2: LastUserStakeInterface;
}

export const farmsInitialState: FarmsState = {
  farms: createEntity({ list: [] }),
  lastStakes: {
    [FarmVersionEnum.V3]: {},
    [FarmVersionEnum.V2]: {},
    [FarmVersionEnum.V1]: {}
  },
  lastStakes2: {},
  allFarms: createEntity([])
};

export interface FarmsRootState {
  farms: FarmsState;
}
