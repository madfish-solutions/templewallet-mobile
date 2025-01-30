import { BigNumber } from 'bignumber.js';

import { RewardsStatsCalculationParams } from '../interfaces/rewards-stats-calculation-params';

import { calculateLuck } from './calculate-luck';
import { getBakingEfficiency } from './get-baking-efficiency';
import { CycleStatus } from './get-cycle-status-icon';

export const getRewardsStats = (params: RewardsStatsCalculationParams) => {
  const { reward, bakerDetails, currentCycle } = params;
  const {
    cycle,
    balance,
    ownBlockRewards,
    extraBlockRewards,
    futureBlockRewards,
    endorsementRewards,
    futureEndorsementRewards,
    stakingBalance,
    expectedBlocks,
    expectedEndorsements,
    ownBlockFees,
    extraBlockFees,
    revelationRewards,
    doubleBakingRewards,
    doubleEndorsingRewards
  } = reward;

  const totalFutureRewards = new BigNumber(futureEndorsementRewards).plus(futureBlockRewards);
  const totalCurrentRewards = new BigNumber(extraBlockRewards)
    .plus(endorsementRewards)
    .plus(ownBlockRewards)
    .plus(ownBlockFees)
    .plus(extraBlockFees)
    .plus(revelationRewards)
    .plus(doubleBakingRewards)
    .plus(doubleEndorsingRewards);
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
  const totalRewards = totalFutureRewards.plus(totalCurrentRewards);
  const rewards = totalRewards.multipliedBy(balance).div(stakingBalance);

  let luck = expectedBlocks + expectedEndorsements > 0 ? new BigNumber(-1) : new BigNumber(0);
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
