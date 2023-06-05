import { BigNumber } from 'bignumber.js';

import { StakesValueInterface } from 'src/interfaces/earn.interface';

import { APPROXIMATE_DAYS_IN_YEAR, calculateTimeDiffInSeconds } from './date.utils';

interface YouvesFarmRewardsStats {
  lastRewards: string; // From farm store
  discFactor: BigNumber;
  vestingPeriodSeconds: BigNumber;
  totalStaked: BigNumber; // Farm total staked
}

const PRECISION_FACTOR_STABLESWAP_LP = 1e24;

export const calculateYouvesFarmingRewards = (
  rewardsStats: YouvesFarmRewardsStats,
  farmRewardTokenBalance: BigNumber, // get from reward token contract for every farm
  stake?: StakesValueInterface // from storage get 'stakes'
) => {
  if (stake === undefined) {
    return {
      claimableReward: new BigNumber(0),
      fullReward: new BigNumber(0)
    };
  }

  const { lastRewards, discFactor, totalStaked, vestingPeriodSeconds } = rewardsStats;
  const { stake: stakeAmount, age_timestamp: ageTimestamp, disc_factor: userDiscFactor } = stake;

  const reward = farmRewardTokenBalance.minus(lastRewards);
  const newDiscFactor = discFactor.plus(
    reward.multipliedBy(PRECISION_FACTOR_STABLESWAP_LP).dividedToIntegerBy(totalStaked)
  );

  const stakeAge = BigNumber.min(
    calculateTimeDiffInSeconds(new Date(ageTimestamp), new Date(Date.now())),
    vestingPeriodSeconds
  );

  const fullReward = stakeAmount
    .times(newDiscFactor.minus(userDiscFactor))
    .dividedToIntegerBy(PRECISION_FACTOR_STABLESWAP_LP);
  const claimableReward = fullReward.times(stakeAge).dividedToIntegerBy(vestingPeriodSeconds);

  return { claimableReward, fullReward };
};

export const aprToApy = (aprPercentage: number, compoundFrequency = APPROXIMATE_DAYS_IN_YEAR) =>
  ((1 + Number(aprPercentage) / 100 / compoundFrequency) ** compoundFrequency - 1) * 100;
