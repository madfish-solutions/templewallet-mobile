import { Farm, SingleFarmResponse, V3FarmStake } from 'src/apis/quipuswap/types';

import { createActions } from '../create-actions';

export const loadSingleFarmActions = createActions<Pick<Farm, 'id' | 'version'>, SingleFarmResponse, void>(
  'farms/LOAD_SINGLE_FARM'
);

export const loadSingleFarmStakeActions = createActions<
  Pick<Farm, 'id' | 'version' | 'contractAddress' | 'rewardToken'>,
  { stake: V3FarmStake; farm: Pick<Farm, 'id' | 'version'> },
  { farm: Pick<Farm, 'id' | 'version'>; error: string }
>('farms/LOAD_SINGLE_FARM_STAKE');
