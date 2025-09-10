import { TzktCycle } from 'src/interfaces/tzkt/cycle.interface';
import { TzktProtocol } from 'src/interfaces/tzkt/protocol.interface';
import { TzktRewardsEntry } from 'src/interfaces/tzkt/rewards-entry.interface';

import { TzktSetDelegateParamsOperation } from './tzkt';

export interface RewardsStatsCalculationParams
  extends Pick<TzktSetDelegateParamsOperation, 'limitOfStakingOverBaking' | 'edgeOfBakingOverStaking'> {
  rewardsEntry: TzktRewardsEntry;
  cycle: TzktCycle;
  protocol: TzktProtocol;
  delegationFee: number;
  minDelegation: number;
}
