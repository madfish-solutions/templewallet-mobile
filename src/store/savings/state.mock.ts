import { EarnOpportunitiesSortFieldEnum } from 'src/enums/earn-opportunities-sort-fields.enum';
import { SavingsProviderEnum } from 'src/enums/savings-provider.enum';

import { createEntity } from '../create-entity';

import { SavingsState } from './state';

export const mockSavingsState: SavingsState = {
  stakes: {},
  allSavingsItems: { [SavingsProviderEnum.Youves]: createEntity([]), [SavingsProviderEnum.KordFi]: createEntity([]) },
  sortField: EarnOpportunitiesSortFieldEnum.Default
};
