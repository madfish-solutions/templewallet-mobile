import { EarnOpportunitiesSortFieldEnum } from 'src/enums/earn-opportunities-sort-fields.enum';

import { createEntity } from '../create-entity';

import { FarmsState } from './state';

export const mockFarmsState: FarmsState = {
  allFarms: createEntity([]),
  lastStakes: {},
  sortField: EarnOpportunitiesSortFieldEnum.Default
};
