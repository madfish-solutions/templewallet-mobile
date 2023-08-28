import { createAction } from '@reduxjs/toolkit';

import { EarnOpportunitiesSortFieldEnum } from 'src/enums/earn-opportunities-sort-fields.enum';
import { KordFiItem, SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';

import { createActions } from '../create-actions';
import { UserStakeInterface } from './state';

export const loadAllSavingsAndStakesAction = createAction<void>('savings/LOAD_ALL_SAVINGS_AND_STAKES');

export const loadAllSavingsActions = createActions<void, Array<SavingsItem>, void>('savings/LOAD_ALL_FARMS');

export const loadAllStakesActions = createActions<Array<SavingsItem>, UserStakeInterface, void>(
  'savings/LOAD_ALL_STAKES'
);

export const loadSingleSavingStakeActions = createActions<
  SavingsItem,
  { stake: UserStakeValueInterface | undefined; contractAddress: string },
  { contractAddress: string; error: string }
>('savings/LOAD_SINGLE_SAVING_STAKE');

export const loadKordFiItemsActions = createActions<void, KordFiItem>('savings/LOAD_KORD_FI');

export const selectSavingsSortValueAction = createAction<EarnOpportunitiesSortFieldEnum>('savings/SELECT_SORT_VALUE');
