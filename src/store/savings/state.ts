import { EarnOpportunitiesSortFieldEnum } from 'src/enums/earn-opportunities-sort-fields.enum';
import { SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export type UserStakeInterface = Record<string, UserStakeValueInterface>;
export interface SavingsState {
  stakes: LoadableEntityState<UserStakeInterface>;
  allSavingsItems: LoadableEntityState<Array<SavingsItem>>;
  sortField: EarnOpportunitiesSortFieldEnum;
}

export const savingsInitialState: SavingsState = {
  stakes: createEntity({}),
  allSavingsItems: createEntity([]),
  sortField: EarnOpportunitiesSortFieldEnum.Default
};
