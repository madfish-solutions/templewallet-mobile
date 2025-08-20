import { BigNumber } from 'bignumber.js';

import { RewardsStatsCalculationParams } from '../interfaces/rewards-stats-calculation-params';

import { calculateLuck } from './calculate-luck';
import { getBakingEfficiency } from './get-baking-efficiency';
import { CycleStatus } from './get-cycle-status-icon';
import { getTotalRewards } from './get-total-rewards';

export const getRewardsStats = (params: RewardsStatsCalculationParams) => {
  const { reward, bakerDetails, currentCycle } = params;
  const { cycle, delegatedBalance, stakedBalance, bakerRewards } = reward;
  const { ownDelegatedBalance, expectedBlocks, expectedAttestations } = bakerRewards;

  const balance = new BigNumber(delegatedBalance).plus(stakedBalance ?? 0);

  const { totalRewards, totalCurrentRewards, totalFutureRewards } = getTotalRewards(reward);

  const cycleStatus: CycleStatus = (() => {
    switch (true) {
      case totalFutureRewards.eq(0) && (currentCycle === undefined || cycle <= currentCycle - 6):
        return CycleStatus.UNLOCKED;
      case totalFutureRewards.eq(0):
        return CycleStatus.LOCKED;
      case totalCurrentRewards.eq(0):
        return CycleStatus.FUTURE;
      default:
        return CycleStatus.IN_PROGRESS;
    }
  })();
  const rewards = totalRewards.multipliedBy(balance).div(ownDelegatedBalance);

  let luck = expectedBlocks + expectedAttestations > 0 ? new BigNumber(-1) : new BigNumber(0);
  if (totalFutureRewards.plus(totalCurrentRewards).gt(0)) {
    luck = calculateLuck(params, totalRewards);
  }

  const bakerFeePart = bakerDetails?.delegation.fee ?? 0;

  const bakerFee = rewards.multipliedBy(bakerFeePart);

  return {
    balance,
    rewards,
    luck,
    bakerFeePart,
    bakerFee,
    cycleStatus,
    efficiency: getBakingEfficiency(params)
  };
};
