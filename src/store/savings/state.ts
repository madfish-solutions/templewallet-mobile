import { EarnOpportunitiesSortFieldEnum } from 'src/enums/earn-opportunities-sort-fields.enum';
import { KordFiItem, SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export type UserStakeInterface = Record<string, UserStakeValueInterface>;
export interface SavingsState {
  allSavingsItems: LoadableEntityState<Array<SavingsItem>>;
  kordFiItems: LoadableEntityState<Array<KordFiItem>>;
  stakes: LoadableEntityState<UserStakeInterface>;
  sortField: EarnOpportunitiesSortFieldEnum;
}

export const savingsInitialState: SavingsState = {
  stakes: createEntity({}),
  kordFiItems: createEntity([]),
  allSavingsItems: createEntity([]),
  sortField: EarnOpportunitiesSortFieldEnum.Default
};
