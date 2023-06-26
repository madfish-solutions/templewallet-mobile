import { SingleFarmResponse } from 'src/apis/quipuswap-staking/types';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export type LastUserStakeInterface = Record<string, UserStakeValueInterface>;
export interface FarmsState {
  allFarms: LoadableEntityState<Array<SingleFarmResponse>>;
  lastStakes: LastUserStakeInterface;
  stakesLoading: boolean;
}

export const farmsInitialState: FarmsState = {
  lastStakes: {},
  allFarms: createEntity([]),
  stakesLoading: false
};

export interface FarmsRootState {
  farms: FarmsState;
}
