import { createAction } from '@reduxjs/toolkit';

import { EarnOpportunitiesSortFieldEnum } from 'src/enums/earn-opportunities-sort-fields.enum';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { Farm } from 'src/types/farm';
import { SingleFarmResponse } from 'src/types/single-farm-response';

import { createActions } from '../create-actions';

export const loadSingleFarmStakeActions = createActions<
  Farm,
  { stake: UserStakeValueInterface | undefined; farmAddress: string },
  { farmAddress: string; error: string }
>('farms/LOAD_SINGLE_FARM_STAKE');

export const loadAllFarmsAndStakesAction = createAction<void>('farms/LOAD_ALL_FARMS_AND_STAKES');

export const loadAllFarmsActions = createActions<void, Array<SingleFarmResponse>, void>('farms/LOAD_ALL_FARMS');

/**
 * `undefined` as the value in success payload stands for failed attempt to load stake, so the old stake should be used;
 * `null` means that a user has no stake in the farm.
 */
export const loadAllStakesActions = createActions<
  Array<SingleFarmResponse>,
  Record<string, UserStakeValueInterface | nullish>,
  void
>('farms/LOAD_ALL_STAKES');

export const selectFarmsSortValueAction = createAction<EarnOpportunitiesSortFieldEnum>('farms/SELECT_SORT_VALUE');
