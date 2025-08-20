import { BigNumber } from 'bignumber.js';

import { RewardsStatsCalculationParams } from '../interfaces/rewards-stats-calculation-params';

export const calculateLuck = (params: RewardsStatsCalculationParams, totalRewards: BigNumber) => {
  const {
    reward,
    fallbackRewardPerOwnBlock,
    fallbackRewardPerEndorsement,
    fallbackRewardPerFutureBlock,
    fallbackRewardPerFutureEndorsement
  } = params;
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
    expectedBlocks,
    expectedAttestations,
    blocks,
    futureBlocks,
    futureAttestations,
    attestations
  } = reward.bakerRewards;
  const rewardPerOwnBlock =
    blocks === 0
      ? fallbackRewardPerOwnBlock
      : new BigNumber(blockRewardsDelegated)
          .plus(blockRewardsStakedOwn)
          .plus(blockRewardsStakedEdge)
          .plus(blockRewardsStakedShared)
          .div(blocks);
  const rewardPerEndorsement =
    attestations === 0
      ? fallbackRewardPerEndorsement
      : new BigNumber(attestationRewardsDelegated)
          .plus(attestationRewardsStakedOwn)
          .plus(attestationRewardsStakedEdge)
          .plus(attestationRewardsStakedShared)
          .div(attestations);
  const asIfNoFutureExpectedBlockRewards = new BigNumber(expectedBlocks).multipliedBy(rewardPerOwnBlock);
  const asIfNoFutureExpectedEndorsementRewards = new BigNumber(expectedAttestations).multipliedBy(rewardPerEndorsement);
  const asIfNoFutureExpectedRewards = asIfNoFutureExpectedBlockRewards.plus(asIfNoFutureExpectedEndorsementRewards);

  const rewardPerFutureBlock =
    futureBlocks === 0 ? fallbackRewardPerFutureBlock : new BigNumber(futureBlockRewards).div(futureBlocks);
  const rewardPerFutureEndorsement =
    futureAttestations === 0
      ? fallbackRewardPerFutureEndorsement
      : new BigNumber(futureAttestationRewards).div(futureAttestations);
  const asIfNoCurrentExpectedBlockRewards = new BigNumber(expectedBlocks).multipliedBy(rewardPerFutureBlock);
  const asIfNoCurrentExpectedEndorsementRewards = new BigNumber(expectedAttestations).multipliedBy(
    rewardPerFutureEndorsement
  );
  const asIfNoCurrentExpectedRewards = asIfNoCurrentExpectedBlockRewards.plus(asIfNoCurrentExpectedEndorsementRewards);

  const weights =
    attestations + futureAttestations === 0
      ? { current: blocks, future: futureBlocks }
      : { current: attestations, future: futureAttestations };
  const totalExpectedRewards =
    weights.current + weights.future === 0
      ? new BigNumber(0)
      : asIfNoFutureExpectedRewards
          .multipliedBy(weights.current)
          .plus(asIfNoCurrentExpectedRewards.multipliedBy(weights.future))
          .div(new BigNumber(weights.current).plus(weights.future));

  return totalRewards.minus(totalExpectedRewards).div(totalExpectedRewards);
};
