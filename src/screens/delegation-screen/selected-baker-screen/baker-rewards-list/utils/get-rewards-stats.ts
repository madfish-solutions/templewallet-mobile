import { BigNumber } from 'bignumber.js';

import { mutezToTz } from 'src/utils/tezos.util';

import { RewardsStatsCalculationParams } from '../interfaces/rewards-stats-calculation-params';

import { calculateLuck } from './calculate-luck';
import { sumFields } from './sum-fields';

export function getRewardsStats(params: RewardsStatsCalculationParams) {
  const { rewardsEntry, cycle, protocol, delegationFee: delegationFeeRatio, minDelegation } = params;
  let { limitOfStakingOverBaking, edgeOfBakingOverStaking } = params;

  limitOfStakingOverBaking /= 1e6;
  edgeOfBakingOverStaking /= 1e9;
  const { delegatedBalance, stakedBalance, bakerRewards } = rewardsEntry;
  const {
    futureAttestations,
    attestations,
    missedAttestations,
    futureBlocks,
    blocks,
    missedBlocks,
    missedAttestationRewards,
    missedBlockFees,
    missedBlockRewards,
    futureBlockRewards,
    futureAttestationRewards,
    blockRewardsDelegated,
    blockRewardsStakedOwn,
    blockRewardsStakedEdge,
    blockRewardsStakedShared,
    blockFees,
    doubleBakingLostStaked,
    doubleEndorsingLostStaked,
    doublePreendorsingLostStaked,
    attestationRewardsDelegated,
    attestationRewardsStakedOwn,
    attestationRewardsStakedEdge,
    attestationRewardsStakedShared,
    ownStakedBalance,
    ownDelegatedBalance,
    externalStakedBalance,
    bakingPower,
    externalDelegatedBalance,
    doubleBakingLostExternalStaked,
    doubleEndorsingLostExternalStaked,
    doublePreendorsingLostExternalStaked,
    expectedBlocks,
    expectedAttestations
  } = bakerRewards;

  const {
    blockReward: legacyBlockReward,
    attestationReward: legacyEndorsementReward,
    attestersPerBlock,
    consensusThreshold
  } = protocol.constants;

  let blockReward: number;
  let blockBonusPerSlot: number;
  let attestationRewardPerSlot: number;
  if ('attestationRewardPerSlot' in cycle) {
    blockReward = cycle.blockReward;
    blockBonusPerSlot = cycle.blockBonusPerSlot;
    attestationRewardPerSlot = cycle.attestationRewardPerSlot;
  } else {
    blockReward = legacyBlockReward[0];
    blockBonusPerSlot = legacyBlockReward[1];
    attestationRewardPerSlot = legacyEndorsementReward[0];
  }

  const rewardsPerBlock = blockReward + blockBonusPerSlot * (attestersPerBlock - consensusThreshold);
  const assignedRewards =
    (futureBlocks + blocks + missedBlocks) * rewardsPerBlock +
    (futureAttestations + attestations + missedAttestations) * attestationRewardPerSlot;

  const earnedRewards = sumFields(
    bakerRewards,
    [
      'blockRewardsDelegated',
      'blockRewardsStakedOwn',
      'blockRewardsStakedEdge',
      'blockRewardsStakedShared',
      'attestationRewardsDelegated',
      'attestationRewardsStakedOwn',
      'attestationRewardsStakedEdge',
      'attestationRewardsStakedShared',
      'blockFees'
    ],
    []
  );
  const extraRewards = sumFields(
    bakerRewards,
    [
      'doubleBakingRewards',
      'doubleEndorsingRewards',
      'doublePreendorsingRewards',
      'vdfRevelationRewardsDelegated',
      'vdfRevelationRewardsStakedOwn',
      'vdfRevelationRewardsStakedEdge',
      'vdfRevelationRewardsStakedShared',
      'nonceRevelationRewardsDelegated',
      'nonceRevelationRewardsStakedOwn',
      'nonceRevelationRewardsStakedEdge',
      'nonceRevelationRewardsStakedShared'
    ],
    [
      'doubleBakingLostStaked',
      'doubleBakingLostUnstaked',
      'doubleBakingLostExternalStaked',
      'doubleBakingLostExternalUnstaked',
      'doubleEndorsingLostStaked',
      'doubleEndorsingLostUnstaked',
      'doubleEndorsingLostExternalStaked',
      'doubleEndorsingLostExternalUnstaked',
      'doublePreendorsingLostStaked',
      'doublePreendorsingLostUnstaked',
      'doublePreendorsingLostExternalStaked',
      'doublePreendorsingLostExternalUnstaked',
      'nonceRevelationLosses'
    ]
  );

  const futureRewards = futureBlockRewards + futureAttestationRewards;
  const totalRewards = earnedRewards + extraRewards;

  // TODO: figure out the meaning of variables with obfuscated names here and below
  const k = sumFields(
    bakerRewards,
    [
      'blockRewardsDelegated',
      'attestationRewardsDelegated',
      'vdfRevelationRewardsDelegated',
      'nonceRevelationRewardsDelegated',
      'doubleBakingRewards',
      'doubleEndorsingRewards',
      'doublePreendorsingRewards',
      'blockFees'
    ],
    []
  );
  const y = sumFields(
    bakerRewards,
    [
      'doubleBakingLostUnstaked',
      'doubleBakingLostExternalUnstaked',
      'doubleEndorsingLostUnstaked',
      'doubleEndorsingLostExternalUnstaked',
      'doublePreendorsingLostUnstaked',
      'doublePreendorsingLostExternalUnstaked',
      'nonceRevelationLosses'
    ],
    []
  );
  const stakedEdgeRewards = sumFields(
    bakerRewards,
    [
      'blockRewardsStakedEdge',
      'attestationRewardsStakedEdge',
      'vdfRevelationRewardsStakedEdge',
      'nonceRevelationRewardsStakedEdge'
    ],
    []
  );
  const stakedSharedRewards = sumFields(
    bakerRewards,
    [
      'blockRewardsStakedShared',
      'attestationRewardsStakedShared',
      'vdfRevelationRewardsStakedShared',
      'nonceRevelationRewardsStakedShared'
    ],
    []
  );
  const stakedEdgeRewardsShare =
    stakedEdgeRewards > 0 ? stakedEdgeRewards / (stakedEdgeRewards + stakedSharedRewards) : 0;
  const doubleOperationsStakedLoss = doubleBakingLostStaked + doubleEndorsingLostStaked + doublePreendorsingLostStaked;
  const j = doubleOperationsStakedLoss * (1 - stakedEdgeRewardsShare);
  const E = doubleOperationsStakedLoss - j;

  let P = 0,
    L = 0,
    S = 0,
    b = 0;
  if (futureRewards > 0) {
    const Vt = ownStakedBalance * limitOfStakingOverBaking;
    const at = ownStakedBalance + Math.min(externalStakedBalance, Vt);
    const N = (futureRewards * at) / bakingPower;
    P = futureRewards - N;
    L = (N * ownStakedBalance) / at;
    S = (N - L) * edgeOfBakingOverStaking;
    b = N - L - S;
  }

  const T = Math.max(0, +P + k - y);
  const x = T * delegationFeeRatio;
  const w =
    ownDelegatedBalance + externalDelegatedBalance > 0
      ? delegatedBalance / (ownDelegatedBalance + externalDelegatedBalance)
      : 0;
  const delegationRewardsAreSent = delegatedBalance / 1e6 >= minDelegation;

  const delegationFee = delegationRewardsAreSent ? Math.round(x * w) : 0;
  const Ft = Math.max(0, +S + stakedEdgeRewards - E);
  const stakedBalanceRatio = stakedBalance && externalStakedBalance > 0 ? stakedBalance / externalStakedBalance : 0;
  const stakingFee = Math.round(Ft * stakedBalanceRatio);
  const bakerFeeMutez = stakingFee + delegationFee;
  const doubleOperationsExternalStakedLoss =
    doubleBakingLostExternalStaked + doubleEndorsingLostExternalStaked + doublePreendorsingLostExternalStaked;
  const tt = Math.max(0, +S + b + stakedEdgeRewards - E + stakedSharedRewards - doubleOperationsExternalStakedLoss);
  const stakingReward = Math.round(tt * stakedBalanceRatio);
  const delegationReward = delegationRewardsAreSent ? Math.round(T * w) : 0;

  const rewards = stakingReward + delegationReward;
  const bakerFeeRatio = bakerFeeMutez / rewards;

  let luck = expectedBlocks + expectedAttestations > 0 ? new BigNumber(-1) : new BigNumber(0);
  if (futureRewards + earnedRewards > 0) {
    luck = calculateLuck(params.rewardsEntry, totalRewards);
  }

  return {
    cycle: cycle.index,
    delegated: localMutezToTz(delegatedBalance),
    bakerFeeRatio: Number.isFinite(bakerFeeRatio) ? bakerFeeRatio : delegationFeeRatio,
    bakerFee: localMutezToTz(bakerFeeMutez),
    expectedPayout: localMutezToTz(rewards - bakerFeeMutez),
    efficiency: new BigNumber(assignedRewards === 0 ? 1 : totalRewards / assignedRewards),
    blockRewards: localMutezToTz(
      blockRewardsDelegated + blockRewardsStakedOwn + blockRewardsStakedEdge + blockRewardsStakedShared
    ),
    totalRewards: localMutezToTz(totalRewards),
    blocks,
    luck,
    blockFees: localMutezToTz(blockFees),
    missedBlockRewards: localMutezToTz(missedBlockRewards),
    missedBlocks,
    missedBlockFees: localMutezToTz(missedBlockFees),
    attestationRewards: localMutezToTz(
      attestationRewardsDelegated +
        attestationRewardsStakedOwn +
        attestationRewardsStakedEdge +
        attestationRewardsStakedShared
    ),
    attestations,
    missedAttestations,
    missedAttestationRewards: localMutezToTz(missedAttestationRewards)
  };
}

const localMutezToTz = (x: number) => mutezToTz(new BigNumber(x), 6);
