import { EarnOpportunitiesSortFieldEnum } from 'src/enums/earn-opportunities-sort-fields.enum';
import { FarmsProviderEnum } from 'src/enums/farms-provider.enum';

import { createEntity } from '../create-entity';

import { FarmsState } from './state';

export const mockFarmsState: FarmsState = {
  allFarms: { [FarmsProviderEnum.Quipuswap]: createEntity([]), [FarmsProviderEnum.LiquidityBaking]: createEntity([]) },
  lastStakes: {},
  sortField: EarnOpportunitiesSortFieldEnum.Default
};
