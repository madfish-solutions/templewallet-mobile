import { createAction } from '@reduxjs/toolkit';

import { Farm, SingleFarmResponse } from 'src/apis/quipuswap-staking/types';
import { FarmsSortFieldEnum } from 'src/enums/farms-sort-fields.enum';

import { createActions } from '../create-actions';
import { LastUserStakeInterface, UserStakeValueInterface } from './state';

export const loadSingleFarmStakeActions = createActions<
  Farm,
  { stake: UserStakeValueInterface | undefined; farmAddress: string },
  { farmAddress: string; error: string }
>('farms/LOAD_SINGLE_FARM_STAKE');

export const loadAllFarmsAndStakesAction = createAction<void>('farms/LOAD_ALL_FARMS_AND_STAKES');

export const loadAllFarmsActions = createActions<void, Array<SingleFarmResponse>, void>('farms/LOAD_ALL_FARMS');

export const loadAllStakesActions = createActions<Array<SingleFarmResponse>, LastUserStakeInterface, void>(
  'farms/LOAD_ALL_STAKES'
);

export const selectSortValueAction = createAction<FarmsSortFieldEnum>('farms/SELECT_SORT_VALUE');
