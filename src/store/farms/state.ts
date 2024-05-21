import { EarnOpportunitiesSortFieldEnum } from 'src/enums/earn-opportunities-sort-fields.enum';
import { FarmsProviderEnum } from 'src/enums/farms-provider.enum';
import { UserEarnOpportunitiesStakes } from 'src/types/earn-opportunity.types';
import { SingleFarmResponse } from 'src/types/single-farm-response';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface FarmsState {
  stakes: Record<string, UserEarnOpportunitiesStakes>;
  allFarms: Record<FarmsProviderEnum, LoadableEntityState<Array<SingleFarmResponse>>>;
  sortField: EarnOpportunitiesSortFieldEnum;
}

export const farmsInitialState: FarmsState = {
  stakes: {},
  allFarms: { [FarmsProviderEnum.Quipuswap]: createEntity([]), [FarmsProviderEnum.LiquidityBaking]: createEntity([]) },
  sortField: EarnOpportunitiesSortFieldEnum.Default
};
