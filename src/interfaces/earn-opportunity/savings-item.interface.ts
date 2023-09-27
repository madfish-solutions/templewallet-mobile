import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';

import { EarnOpportunityBase } from './earn-opportunity-base.interface';

export interface SavingsItem extends EarnOpportunityBase {
  discFactor: string;
  type: EarnOpportunityTypeEnum.YOUVES_SAVING | EarnOpportunityTypeEnum.YOUVES_STAKING;
}
