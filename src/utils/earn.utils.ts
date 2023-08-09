import { BigNumber } from 'bignumber.js';

import { tzktApi } from 'src/api.service';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { EarnOpportunityTokenStandardEnum } from 'src/enums/earn-opportunity-token-standard.enum';
import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { EarnOpportunityToken } from 'src/interfaces/earn-opportunity/earn-opportunity-token.interface';
import { StakesValueInterface } from 'src/interfaces/earn.interface';
import { TokenStandardsEnum } from 'src/token/interfaces/token-metadata.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { EarnOpportunity } from 'src/types/earn-opportunity.type';
import { Farm } from 'src/types/farm';

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

export const sortByNewest = (itemA: EarnOpportunity, itemB: EarnOpportunity) =>
  new Date(itemB?.firstActivityTime ?? Date.now()).getTime() -
  new Date(itemA?.firstActivityTime ?? Date.now()).getTime();

export const sortByOldest = (itemA: EarnOpportunity, itemB: EarnOpportunity) => sortByNewest(itemB, itemA);

export const sortByApr = (itemA: EarnOpportunity, itemB: EarnOpportunity) =>
  new BigNumber(itemB?.apr ?? 0).minus(itemA?.apr ?? 0).toNumber();

export const convertEarnOpportunityToken = (rawToken: EarnOpportunityToken): TokenInterface => {
  const { fa2TokenId, contractAddress, metadata, type } = rawToken;
  const { name, symbol, decimals, thumbnailUri } = metadata;

  return {
    balance: '0',
    visibility: VisibilityEnum.Visible,
    id: fa2TokenId ?? 0,
    address: contractAddress === 'tez' ? '' : contractAddress,
    iconName: contractAddress === 'tez' ? IconNameEnum.TezToken : undefined,
    name,
    symbol,
    decimals,
    thumbnailUri,
    standard: type === EarnOpportunityTokenStandardEnum.Fa2 ? TokenStandardsEnum.Fa2 : TokenStandardsEnum.Fa12
  };
};

const farmEarnOpportunityTypes = [
  EarnOpportunityTypeEnum.STABLESWAP,
  EarnOpportunityTypeEnum.DEX_TWO,
  EarnOpportunityTypeEnum.LIQUIDITY_BAKING
];
export const isFarm = (earnOpportunity: EarnOpportunity): earnOpportunity is Farm =>
  farmEarnOpportunityTypes.includes(earnOpportunity.type ?? EarnOpportunityTypeEnum.DEX_TWO);

export const getFirstAccountActivityTime = async (address: string) =>
  tzktApi.get<{ firstActivityTime: string }>(`/accounts/${address}`).then(response => response.data.firstActivityTime);

export const aprToApy = (aprPercentage: number, compoundFrequency = APPROXIMATE_DAYS_IN_YEAR) =>
  ((1 + Number(aprPercentage) / 100 / compoundFrequency) ** compoundFrequency - 1) * 100;
