import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';

import { useFarmStoreSelector } from 'src/store/farms/selectors';
import { aprToApy } from 'src/utils/earn.utils';
import { isDefined } from 'src/utils/is-defined';
import { mutezToTz } from 'src/utils/tezos.util';

const DEFAULT_AMOUNT = 0;

export const useUserFarmingStats = () => {
  const farms = useFarmStoreSelector();

  return useMemo(() => {
    const result = {
      netApy: new BigNumber(DEFAULT_AMOUNT),
      totalStakedAmountInUsd: new BigNumber(DEFAULT_AMOUNT),
      totalClaimableRewardsInUsd: new BigNumber(DEFAULT_AMOUNT),
      maxApy: BigNumber.maximum(
        DEFAULT_AMOUNT,
        ...farms.allFarms.data.map(({ item }) => aprToApy(Number(item.apr) ?? DEFAULT_AMOUNT))
      )
    };

    let totalWeightedApy = new BigNumber(DEFAULT_AMOUNT);

    Object.entries(farms.lastStakes).forEach(([address, stakeRecord]) => {
      const farm = farms.allFarms.data.find(_farm => _farm.item.contractAddress === address);

      if (isDefined(farm)) {
        const depositValueInUsd = mutezToTz(
          new BigNumber(stakeRecord.depositAmountAtomic ?? DEFAULT_AMOUNT),
          farm.item.stakedToken.metadata.decimals
        ).multipliedBy(farm.item.depositExchangeRate ?? DEFAULT_AMOUNT);

        totalWeightedApy = totalWeightedApy.plus(
          new BigNumber(aprToApy(Number(farm.item.apr) ?? DEFAULT_AMOUNT)).multipliedBy(depositValueInUsd)
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
      result.netApy = totalWeightedApy.dividedBy(result.totalStakedAmountInUsd);
    }

    return result;
  }, [farms]);
};
