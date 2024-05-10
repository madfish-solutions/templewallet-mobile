import { createAction } from '@reduxjs/toolkit';

import { EarnOpportunitiesSortFieldEnum } from 'src/enums/earn-opportunities-sort-fields.enum';
import { SavingsProviderEnum } from 'src/enums/savings-provider.enum';
import { SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';

import { createActions } from '../create-actions';
import { LoadableEntityState } from '../types';

export const loadSingleSavingStakeActions = createActions<
  { item: SavingsItem; accountPkh: string },
  { contractAddress: string; accountPkh: string; stake: UserStakeValueInterface | undefined },
  { contractAddress: string; accountPkh: string; error: string }
>('savings/LOAD_SINGLE_SAVING_STAKE');

/** Use it for loading both savings and stakes gradually */
export const loadAllSavingsAndStakesAction = createAction<string>('savings/LOAD_ALL_SAVINGS_AND_STAKES');

/** Use it to load savings only by "all or nothing" strategy */
export const loadAllSavingsAction = createAction<void>('savings/LOAD_ALL_SAVINGS');

export const loadSavingsByProviderActions = createActions<
  SavingsProviderEnum,
  { provider: SavingsProviderEnum; data: Array<SavingsItem> },
  { provider: SavingsProviderEnum; error: string }
>('savings/LOAD_SAVINGS_BY_PROVIDER');

export const loadAllStakesActions = createActions<
  { accountPkh: string; savings: Array<SavingsItem> },
  { accountPkh: string; stakes: Record<string, LoadableEntityState<UserStakeValueInterface | undefined>> },
  void
>('savings/LOAD_ALL_STAKES');

export const selectSavingsSortValueAction = createAction<EarnOpportunitiesSortFieldEnum>('savings/SELECT_SORT_VALUE');
