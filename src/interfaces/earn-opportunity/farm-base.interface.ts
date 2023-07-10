import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';

import { EarnOpportunityBase } from './earn-opportunity-base.interface';

export interface FarmBase extends EarnOpportunityBase {
  dailyDistribution: string;
  dailyDistributionDollarEquivalent: string;
  type?: EarnOpportunityTypeEnum.STABLESWAP | EarnOpportunityTypeEnum.DEX_TWO;
}
