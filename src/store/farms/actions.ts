import { Farm, SingleFarmResponse } from 'src/apis/quipuswap-staking/types';

import { createActions } from '../create-actions';
import { LastUserStakeInterface } from './state';

export const loadSingleFarmActions = createActions<Pick<Farm, 'id' | 'version'>, SingleFarmResponse, void>(
  'farms/LOAD_SINGLE_FARM'
);

export const loadAllFarmsActions = createActions<void, Array<SingleFarmResponse>, void>('farms/LOAD_ALL_FARMS');

export const loadAllStakesActions = createActions<Array<SingleFarmResponse>, LastUserStakeInterface, void>(
  'farms/LOAD_ALL_STAKES'
);
