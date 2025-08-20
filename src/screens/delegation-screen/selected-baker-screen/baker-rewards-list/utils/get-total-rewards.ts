import { BigNumber } from 'bignumber.js';

import { BakerRewardInterface } from 'src/interfaces/baker-reward.interface';

export const getTotalRewards = (reward: BakerRewardInterface) => {
  const { bakerRewards } = reward;

  const {
    blockRewardsDelegated,
    blockRewardsStakedShared,
    blockRewardsStakedOwn,
    blockRewardsStakedEdge,
    futureBlockRewards,
    futureAttestationRewards,
    attestationRewardsDelegated,
    attestationRewardsStakedShared,
    attestationRewardsStakedOwn,
    attestationRewardsStakedEdge,
    blockFees,
    nonceRevelationRewardsDelegated,
    nonceRevelationRewardsStakedEdge,
    nonceRevelationRewardsStakedOwn,
    nonceRevelationRewardsStakedShared,
    vdfRevelationRewardsDelegated,
    vdfRevelationRewardsStakedEdge,
    vdfRevelationRewardsStakedOwn,
    vdfRevelationRewardsStakedShared,
    doubleBakingRewards,
    doubleEndorsingRewards
  } = bakerRewards;

  const totalFutureRewards = new BigNumber(futureAttestationRewards).plus(futureBlockRewards);
  const totalCurrentRewards = new BigNumber(blockRewardsDelegated)
    .plus(blockRewardsStakedOwn)
    .plus(blockRewardsStakedEdge)
    .plus(blockRewardsStakedShared)
    .plus(attestationRewardsDelegated)
    .plus(attestationRewardsStakedOwn)
    .plus(attestationRewardsStakedEdge)
    .plus(attestationRewardsStakedShared)
    .plus(blockFees)
    .plus(nonceRevelationRewardsDelegated)
    .plus(nonceRevelationRewardsStakedEdge)
    .plus(nonceRevelationRewardsStakedOwn)
    .plus(nonceRevelationRewardsStakedShared)
    .plus(vdfRevelationRewardsDelegated)
    .plus(vdfRevelationRewardsStakedEdge)
    .plus(vdfRevelationRewardsStakedOwn)
    .plus(vdfRevelationRewardsStakedShared)
    .plus(doubleBakingRewards)
    .plus(doubleEndorsingRewards);

  return {
    totalCurrentRewards,
    totalFutureRewards,
    totalRewards: totalFutureRewards.plus(totalCurrentRewards)
  };
};
