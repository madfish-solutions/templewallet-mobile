import { FarmsListResponse, FarmVersionEnum, V3FarmStake } from 'src/apis/quipuswap-staking/types';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface FarmsState {
  farms: LoadableEntityState<FarmsListResponse>;
  lastStakes: Record<FarmVersionEnum, Record<string, LoadableEntityState<V3FarmStake>>>;
}

export const farmsInitialState: FarmsState = {
  farms: createEntity({ list: [] }),
  lastStakes: {
    [FarmVersionEnum.V3]: {},
    [FarmVersionEnum.V2]: {},
    [FarmVersionEnum.V1]: {}
  }
};

export interface FarmsRootState {
  farms: FarmsState;
}
