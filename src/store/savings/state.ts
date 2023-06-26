import { SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export type UserStakeInterface = Record<string, UserStakeValueInterface>;
export interface SavingsState {
  allSavingsItems: LoadableEntityState<Array<SavingsItem>>;
  stakes: LoadableEntityState<UserStakeInterface>;
}

export const savingsInitialState: SavingsState = {
  stakes: createEntity({}),
  allSavingsItems: createEntity([])
};

export interface SavingsRootState {
  savings: SavingsState;
}
