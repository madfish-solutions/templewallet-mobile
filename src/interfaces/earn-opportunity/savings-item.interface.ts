import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';

import { EarnOpportunityBase } from './earn-opportunity-base.interface';

export interface SavingsItem extends EarnOpportunityBase {
  discFactor: string;
  type: EarnOpportunityTypeEnum.YOUVES_SAVING | EarnOpportunityTypeEnum.YOUVES_STAKING;
}

export interface KordFiLendStats {
  xtzApy: number;
  xtzTotalSupplyUsd: number;
  xtzTotalBorrowUsd: number;
  xtzTvlUsd: number;
  tzbtcApy: number;
  tzbtcTotalSupplyUsd: number;
  tzbtcTotalBorrowUsd: number;
  tzbtcTvlUsd: number;
  tvlUsd: number;
}

export interface KordFiLendUserInfo {
  xtzDeposit: number;
  xtzDepositUsd: number;
  tzbtcDeposit: number;
  tzbtcDepositUsd: number;
  currentSavingsAmount: number;
}
