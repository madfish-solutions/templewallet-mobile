import { EarnOpportunitiesSortFieldEnum } from 'src/enums/earn-opportunities-sort-fields.enum';
import { SavingsProviderEnum } from 'src/enums/savings-provider.enum';
import { SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';
import { UserEarnOpportunitiesStakes } from 'src/types/earn-opportunity.types';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface SavingsState {
  stakes: Record<string, UserEarnOpportunitiesStakes>;
  allSavingsItems: Record<SavingsProviderEnum, LoadableEntityState<Array<SavingsItem>>>;
  sortField: EarnOpportunitiesSortFieldEnum;
}

export const savingsInitialState: SavingsState = {
  stakes: {},
  allSavingsItems: { [SavingsProviderEnum.Youves]: createEntity([]) },
  sortField: EarnOpportunitiesSortFieldEnum.Default
};
