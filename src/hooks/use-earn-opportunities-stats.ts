import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';

import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';
import { EarnOpportunity } from 'src/types/earn-opportunity.type';
import { atomicTokenAmountToFiat } from 'src/utils/fiat.utils';
import { isDefined } from 'src/utils/is-defined';

const DEFAULT_AMOUNT = 0;

export const useEarnOpportunitiesStats = (
  earnOpportunities: EarnOpportunity[],
  userStakes: Record<string, UserStakeValueInterface>
) => {
  const fiatToUsdRate = useFiatToUsdRateSelector();

  return useMemo(() => {
    const result = {
      netApr: new BigNumber(DEFAULT_AMOUNT),
      totalStakedAmountInFiat: new BigNumber(DEFAULT_AMOUNT),
      totalClaimableRewardsInFiat: new BigNumber(DEFAULT_AMOUNT),
      maxApr: BigNumber.maximum(DEFAULT_AMOUNT, ...earnOpportunities.map(item => item.apr ?? DEFAULT_AMOUNT))
    };

    let totalWeightedApr = new BigNumber(DEFAULT_AMOUNT);

    Object.entries(userStakes).forEach(([address, stakeRecord]) => {
      const item = earnOpportunities.find(({ contractAddress }) => contractAddress === address);

      if (!isDefined(item)) {
        return;
      }

      const depositValueInFiat = atomicTokenAmountToFiat(
        new BigNumber(stakeRecord.depositAmountAtomic ?? DEFAULT_AMOUNT),
        item.stakedToken.metadata.decimals,
        item.depositExchangeRate,
        fiatToUsdRate
      );

      totalWeightedApr = totalWeightedApr.plus(
        new BigNumber(item.apr ?? DEFAULT_AMOUNT).multipliedBy(depositValueInFiat)
      );
      result.totalStakedAmountInFiat = result.totalStakedAmountInFiat.plus(depositValueInFiat);
      result.totalClaimableRewardsInFiat = result.totalClaimableRewardsInFiat.plus(
        atomicTokenAmountToFiat(
          new BigNumber(stakeRecord.claimableRewards ?? DEFAULT_AMOUNT),
          item.rewardToken.metadata.decimals,
          item.earnExchangeRate,
          fiatToUsdRate
        )
      );
    });

    if (result.totalStakedAmountInFiat.isGreaterThan(DEFAULT_AMOUNT)) {
      result.netApr = totalWeightedApr.dividedBy(result.totalStakedAmountInFiat);
    }

    return result;
  }, [earnOpportunities, userStakes, fiatToUsdRate]);
};
