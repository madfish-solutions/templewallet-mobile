import { FarmPoolTypeEnum } from 'src/enums/farm-pool-type.enum';

import { FarmToken } from './farm-token.interface';

export interface FarmBase {
  id: string;
  contractAddress: string;
  apr: string | null;
  depositExchangeRate: string | null;
  depositTokenUrl: string;
  dailyDistribution: string;
  dailyDistributionDollarEquivalent: string;
  earnExchangeRate: string | null;
  vestingPeriodSeconds: string;
  stakeUrl: string;
  stakedToken: FarmToken;
  tokens: FarmToken[];
  rewardToken: FarmToken;
  staked: string;
  tvlInUsd: string | null;
  tvlInStakedToken: string;
  type?: FarmPoolTypeEnum;
}
