import { EarnOpportunitiesSortFieldEnum } from 'src/enums/earn-opportunities-sort-fields.enum';

import { createEntity } from '../create-entity';

import { SavingsState } from './state';

export const mockSavingsState: SavingsState = {
  stakes: {},
  allSavingsItems: createEntity([]),
  sortField: EarnOpportunitiesSortFieldEnum.Default
};
