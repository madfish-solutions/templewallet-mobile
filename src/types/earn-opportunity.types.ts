import { SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { LoadableEntityState } from 'src/store/types';

import { Farm } from './farm';

export type EarnOpportunity = Farm | SavingsItem;

export type UserEarnOpportunitiesStakes = Record<
  string,
  LoadableEntityState<UserStakeValueInterface | null | undefined>
>;
