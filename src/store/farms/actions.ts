import { createAction } from '@reduxjs/toolkit';

import { EarnOpportunitiesSortFieldEnum } from 'src/enums/earn-opportunities-sort-fields.enum';
import { FarmsProviderEnum } from 'src/enums/farms-provider.enum';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { Farm } from 'src/types/farm';
import { SingleFarmResponse } from 'src/types/single-farm-response';

import { createActions } from '../create-actions';
import { LoadableEntityState } from '../types';

export const loadSingleFarmStakeActions = createActions<
  { farm: Farm; accountPkh: string },
  { farmAddress: string; accountPkh: string; stake: UserStakeValueInterface | null },
  { farmAddress: string; accountPkh: string; error: string }
>('farms/LOAD_SINGLE_FARM_STAKE');

/** Use it for loading both farms and stakes gradually */
export const loadAllFarmsAndStakesAction = createAction<string>('farms/LOAD_ALL_FARMS_AND_STAKES');

/** Use it to load farms only by "all or nothing" strategy */
export const loadAllFarmsAction = createAction<void>('farms/LOAD_ALL_FARMS');

export const loadFarmsByProviderActions = createActions<
  FarmsProviderEnum,
  { provider: FarmsProviderEnum; data: Array<SingleFarmResponse> },
  { provider: FarmsProviderEnum; error: string }
>('farms/LOAD_FARMS_BY_PROVIDER');

export const loadAllStakesActions = createActions<
  { accountPkh: string; farms: Array<SingleFarmResponse> },
  { accountPkh: string; stakes: Record<string, LoadableEntityState<UserStakeValueInterface | null | undefined>> },
  void
>('farms/LOAD_ALL_STAKES');

export const selectFarmsSortValueAction = createAction<EarnOpportunitiesSortFieldEnum>('farms/SELECT_SORT_VALUE');
