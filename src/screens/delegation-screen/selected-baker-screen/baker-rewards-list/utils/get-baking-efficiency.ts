import { BigNumber } from 'bignumber.js';

import { RewardsStatsCalculationParams } from '../interfaces/rewards-stats-calculation-params';

import { getTotalRewards } from './get-total-rewards';

export const getBakingEfficiency = ({ reward }: RewardsStatsCalculationParams) => {
  const {
    blocks,
    futureBlocks,
    futureAttestations,
    attestations,
    missedAttestationRewards,
    missedBlockFees,
    missedBlockRewards
  } = reward.bakerRewards;

  const { totalRewards } = getTotalRewards(reward);

  const fullEfficiencyIncome = new BigNumber(4e7)
    .multipliedBy(new BigNumber(blocks).plus(futureBlocks))
    .plus(new BigNumber(1.25e6).multipliedBy(new BigNumber(attestations).plus(futureAttestations)));
  const totalLost = new BigNumber(missedAttestationRewards).plus(missedBlockFees).plus(missedBlockRewards);
  const totalGain = totalRewards.minus(totalLost).minus(fullEfficiencyIncome);

  return new BigNumber(1).plus(totalGain.div(fullEfficiencyIncome));
};
