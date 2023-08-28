import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';

import { EarnOpportunityBase } from './earn-opportunity-base.interface';

export interface SavingsItem extends EarnOpportunityBase {
  discFactor: string;
  type: EarnOpportunityTypeEnum.YOUVES_SAVING | EarnOpportunityTypeEnum.YOUVES_STAKING;
}
export interface KordFiItem {
  user: string;
  xtz: {
    apy: number;
    totalSuppliedUsd: number;
    totalBorrowedUsd: number;
    userDepositeUsd: number;
  };
  tzbtc: {
    apy: number;
    totalSuppliedUsd: number;
    totalBorrowedUsd: number;
    userDepositeUsd: number;
  };
  total: {
    userApy: number;
    userDeposite: number;
  };
}
