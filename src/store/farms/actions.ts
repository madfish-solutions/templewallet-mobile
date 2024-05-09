import { createAction } from '@reduxjs/toolkit';

import { EarnOpportunitiesSortFieldEnum } from 'src/enums/earn-opportunities-sort-fields.enum';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { Farm } from 'src/types/farm';
import { SingleFarmResponse } from 'src/types/single-farm-response';

import { createActions } from '../create-actions';
import { LoadableEntityState } from '../types';

export const loadSingleFarmStakeActions = createActions<
  { farm: Farm; accountPkh: string },
  { farmAddress: string; accountPkh: string; stake: UserStakeValueInterface | undefined },
  { farmAddress: string; accountPkh: string; error: string }
>('farms/LOAD_SINGLE_FARM_STAKE');

export const loadAllFarmsAndStakesAction = createAction<string>('farms/LOAD_ALL_FARMS_AND_STAKES');

export const loadAllFarmsActions = createActions<void, Array<SingleFarmResponse>, void>('farms/LOAD_ALL_FARMS');

export const loadAllStakesActions = createActions<
  { accountPkh: string; farms: Array<SingleFarmResponse> },
  { accountPkh: string; stakes: Record<string, LoadableEntityState<UserStakeValueInterface | undefined>> },
  void
>('farms/LOAD_ALL_STAKES');

export const selectFarmsSortValueAction = createAction<EarnOpportunitiesSortFieldEnum>('farms/SELECT_SORT_VALUE');
