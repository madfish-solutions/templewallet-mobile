import { FarmsSortFieldEnum } from 'src/enums/farms-sort-fields.enum';

import { createEntity } from '../create-entity';
import { FarmsState } from './state';

export const mockFarmsState: FarmsState = {
  allFarms: createEntity([]),
  lastStakes: {},
  stakesLoading: false,
  sortField: FarmsSortFieldEnum.Default
};
