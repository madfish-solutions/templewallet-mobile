import { BigNumber } from 'bignumber.js';

import { FarmVersionEnum } from 'src/apis/quipuswap-staking/types';
import { isDefined } from 'src/utils/is-defined';
import { mutezToTz } from 'src/utils/tezos.util';

import { useSelector } from '../selector';

const DEFAULT_AMOUNT = 0;

export const useFarmsLoadingSelector = () => useSelector(({ farms }) => farms.farms.isLoading);

export const useFarmSelector = (id: string, version: FarmVersionEnum) =>
  useSelector(({ farms }) => {
    const { list } = farms.farms.data;

    return list.find(({ item }) => item.id === id && item.version === version);
  });

export const useAllFarmsSelector = () => useSelector(({ farms }) => farms.allFarms);
export const useLastStakesSelector = () => useSelector(({ farms }) => farms.lastStakes);

export const useMainInfoSelector = () =>
  useSelector(({ farms }) => {
    const result = {
      totalStakedAmountInUsd: new BigNumber(DEFAULT_AMOUNT),
      netApy: new BigNumber(DEFAULT_AMOUNT),
      totalClaimableRewardsInUsd: new BigNumber(DEFAULT_AMOUNT)
    };

    let totalWeightedApr = new BigNumber(DEFAULT_AMOUNT);

    Object.entries(farms.lastStakes).forEach(([address, stakeRecord]) => {
      const farm = farms.allFarms.data.find(_farm => _farm.item.contractAddress === address);

      if (isDefined(farm)) {
        const depositValueInUsd = mutezToTz(
          new BigNumber(stakeRecord.depositAmountAtomic ?? DEFAULT_AMOUNT),
          farm.item.stakedToken.metadata.decimals
        ).multipliedBy(farm.item.depositExchangeRate ?? DEFAULT_AMOUNT);

        totalWeightedApr = totalWeightedApr.plus(
          new BigNumber(farm.item.apr ?? DEFAULT_AMOUNT).multipliedBy(depositValueInUsd)
        );
        result.totalStakedAmountInUsd = result.totalStakedAmountInUsd.plus(depositValueInUsd);
        result.totalClaimableRewardsInUsd = result.totalClaimableRewardsInUsd.plus(
          mutezToTz(
            new BigNumber(stakeRecord.claimableRewards ?? DEFAULT_AMOUNT),
            farm.item.rewardToken.metadata.decimals
          ).multipliedBy(farm.item.earnExchangeRate ?? DEFAULT_AMOUNT)
        );
      }
    });

    if (result.totalStakedAmountInUsd.isGreaterThan(DEFAULT_AMOUNT)) {
      result.netApy = totalWeightedApr.dividedBy(result.totalStakedAmountInUsd);
    }

    return {
      netApy: result.netApy.toFixed(2),
      totalStakedAmountInUsd: result.totalStakedAmountInUsd.toFixed(2),
      totalClaimableRewardsInUsd: result.totalClaimableRewardsInUsd.toFixed(2)
    };
  });
