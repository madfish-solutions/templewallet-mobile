import { Farm, SingleFarmResponse } from 'src/apis/quipuswap-staking/types';

import { createActions } from '../create-actions';

export const loadSingleFarmActions = createActions<Pick<Farm, 'id' | 'version'>, SingleFarmResponse, void>(
  'farms/LOAD_SINGLE_FARM'
);
