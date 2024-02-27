import { createAction } from '@reduxjs/toolkit';

import { EarnOpportunitiesSortFieldEnum } from 'src/enums/earn-opportunities-sort-fields.enum';
import { SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';

import { createActions } from '../create-actions';

export const loadAllSavingsAndStakesAction = createAction<void>('savings/LOAD_ALL_SAVINGS_AND_STAKES');

export const loadAllSavingsActions = createActions<void, Array<SavingsItem>, void>('savings/LOAD_ALL_FARMS');

/**
 * `undefined` as the value in success payload stands for failed attempt to load stake, so the old stake should be used;
 * `null` means that a user has no stake in the farm.
 */
export const loadAllStakesActions = createActions<
  Array<SavingsItem>,
  Record<string, UserStakeValueInterface | nullish>,
  void
>('savings/LOAD_ALL_STAKES');

export const loadSingleSavingStakeActions = createActions<
  SavingsItem,
  { stake: UserStakeValueInterface | undefined; contractAddress: string },
  { contractAddress: string; error: string }
>('savings/LOAD_SINGLE_SAVING_STAKE');

export const selectSavingsSortValueAction = createAction<EarnOpportunitiesSortFieldEnum>('savings/SELECT_SORT_VALUE');
