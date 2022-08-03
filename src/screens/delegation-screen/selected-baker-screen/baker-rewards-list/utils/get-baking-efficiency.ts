/* eslint-disable no-bitwise */
import { BigNumber } from 'bignumber.js';

import { RewardsStatsCalculationParams } from '../interfaces/rewards-stats-calculation-params';

const defaultRewardConfigHistory = [
  {
    cycle: 0,
    value: {
      blocks: true,
      endorses: true,
      fees: true,
      accusationRewards: true,
      accusationLostDeposits: true,
      accusationLostRewards: true,
      accusationLostFees: true,
      revelationRewards: true,
      revelationLostRewards: true,
      revelationLostFees: true,
      missedBlocks: true,
      stolenBlocks: true,
      missedEndorses: true,
      lowPriorityEndorses: true
    }
  }
];

export const getBakingEfficiency = ({ reward, bakerDetails }: RewardsStatsCalculationParams) => {
  const {
    cycle,
    ownBlockRewards,
    extraBlockRewards,
    futureBlockRewards,
    endorsementRewards,
    futureEndorsementRewards,
    ownBlocks,
    futureBlocks,
    futureEndorsements,
    endorsements,
    ownBlockFees,
    extraBlockFees,
    revelationRewards,
    doubleBakingRewards,
    doubleEndorsingRewards,
    missedEndorsementRewards,
    missedExtraBlockRewards,
    missedExtraBlockFees,
    missedOwnBlockFees,
    missedOwnBlockRewards
  } = reward;

  const rewardConfigHistory =
    bakerDetails?.config?.rewardStruct.map(({ cycle, value: rewardStruct }) => ({
      cycle,
      value: {
        blocks: (rewardStruct & 1) > 0,
        endorses: (rewardStruct & 2) > 0,
        fees: (rewardStruct & 4) > 0,
        accusationRewards: (rewardStruct & 8) > 0,
        accusationLostDeposits: (rewardStruct & 16) > 0,
        accusationLostRewards: (rewardStruct & 32) > 0,
        accusationLostFees: (rewardStruct & 64) > 0,
        revelationRewards: (rewardStruct & 128) > 0,
        revelationLostRewards: (rewardStruct & 256) > 0,
        revelationLostFees: (rewardStruct & 512) > 0,
        missedBlocks: (rewardStruct & 1024) > 0,
        stolenBlocks: (rewardStruct & 2048) > 0,
        missedEndorses: (rewardStruct & 4096) > 0,
        lowPriorityEndorses: (rewardStruct & 8192) > 0
      }
    })) ?? defaultRewardConfigHistory;

  let rewardConfig = defaultRewardConfigHistory[0].value;

  for (const historyEntry of rewardConfigHistory) {
    if (cycle >= historyEntry.cycle) {
      rewardConfig = historyEntry.value;
      break;
    }
  }
  const totalFutureRewards = new BigNumber(rewardConfig.endorses ? futureEndorsementRewards : 0).plus(
    rewardConfig.blocks ? futureBlockRewards : 0
  );
  const totalCurrentRewards = new BigNumber(
    rewardConfig.blocks ? new BigNumber(extraBlockRewards).plus(ownBlockRewards) : 0
  )
    .plus(rewardConfig.endorses ? new BigNumber(endorsementRewards).plus(doubleEndorsingRewards) : 0)
    .plus(rewardConfig.fees ? new BigNumber(ownBlockFees).plus(extraBlockFees) : 0)
    .plus(rewardConfig.revelationRewards ? revelationRewards : 0)
    .plus(doubleBakingRewards);
  const totalRewards = totalFutureRewards.plus(totalCurrentRewards);

  const fullEfficiencyIncome = new BigNumber(4e7)
    .multipliedBy(new BigNumber(ownBlocks).plus(futureBlocks))
    .plus(new BigNumber(1.25e6).multipliedBy(new BigNumber(endorsements).plus(futureEndorsements)));
  const totalLost = new BigNumber(missedEndorsementRewards)
    .plus(missedExtraBlockFees)
    .plus(missedExtraBlockRewards)
    .plus(missedOwnBlockFees)
    .plus(missedOwnBlockRewards);
  const totalGain = totalRewards.minus(totalLost).minus(fullEfficiencyIncome);

  return new BigNumber(1).plus(totalGain.div(fullEfficiencyIncome));
};
