import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';

import { EarnOpportunityToken } from './earn-opportunity-token.interface';

export interface EarnOpportunityBase {
  id: string;
  contractAddress: string;
  apr: string | null;
  depositExchangeRate: string | null;
  depositTokenUrl: string;
  earnExchangeRate: string | null;
  vestingPeriodSeconds: string;
  stakeUrl: string;
  stakedToken: EarnOpportunityToken;
  tokens: EarnOpportunityToken[];
  rewardToken: EarnOpportunityToken;
  staked: string;
  tvlInUsd: string | null;
  tvlInStakedToken: string;
  type?: EarnOpportunityTypeEnum;
  firstActivityTime: string;
}
