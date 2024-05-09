import { createAction } from '@reduxjs/toolkit';

import { EarnOpportunitiesSortFieldEnum } from 'src/enums/earn-opportunities-sort-fields.enum';
import { SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';

import { createActions } from '../create-actions';
import { LoadableEntityState } from '../types';

export const loadSingleSavingStakeActions = createActions<
  { item: SavingsItem; accountPkh: string },
  { contractAddress: string; accountPkh: string; stake: UserStakeValueInterface | undefined },
  { contractAddress: string; accountPkh: string; error: string }
>('savings/LOAD_SINGLE_SAVING_STAKE');

export const loadAllSavingsAndStakesAction = createAction<string>('savings/LOAD_ALL_SAVINGS_AND_STAKES');

export const loadAllSavingsActions = createActions<void, Array<SavingsItem>, void>('savings/LOAD_ALL_FARMS');

export const loadAllStakesActions = createActions<
  { accountPkh: string; savings: Array<SavingsItem> },
  { accountPkh: string; stakes: Record<string, LoadableEntityState<UserStakeValueInterface | undefined>> },
  void
>('savings/LOAD_ALL_STAKES');

export const selectSavingsSortValueAction = createAction<EarnOpportunitiesSortFieldEnum>('savings/SELECT_SORT_VALUE');
