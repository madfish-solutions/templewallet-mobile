import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';

import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';
import { EarnOpportunity } from 'src/types/earn-opportunity.types';
import { atomicTokenAmountToFiat } from 'src/utils/fiat.utils';
import { isDefined } from 'src/utils/is-defined';
import { ZERO } from 'src/utils/number.util';

export const useEarnOpportunitiesStats = (
  earnOpportunities: EarnOpportunity[],
  userStakes: Record<string, UserStakeValueInterface | undefined>,
  someStakesWereLoading: boolean
) => {
  const fiatToUsdRate = useFiatToUsdRateSelector();

  return useMemo(() => {
    if (earnOpportunities.length === 0) {
      return {
        netApr: undefined,
        totalStakedAmountInFiat: undefined,
        totalClaimableRewardsInFiat: undefined,
        maxApr: undefined
      };
    }

    const maxApr = BigNumber.maximum(ZERO, ...earnOpportunities.map(item => getCorrectApr(item.apr)));

    if (!someStakesWereLoading) {
      return {
        netApr: undefined,
        totalStakedAmountInFiat: undefined,
        totalClaimableRewardsInFiat: undefined,
        maxApr
      };
    }

    const result = {
      netApr: ZERO,
      totalStakedAmountInFiat: ZERO,
      totalClaimableRewardsInFiat: ZERO,
      maxApr
    };

    let totalWeightedApr = ZERO;

    Object.entries(userStakes).forEach(([address, stakeRecord]) => {
      if (!stakeRecord) {
        return;
      }

      const item = earnOpportunities.find(({ contractAddress }) => contractAddress === address);

      if (!isDefined(item)) {
        return;
      }

      const depositValueInFiat = atomicTokenAmountToFiat(
        new BigNumber(stakeRecord.depositAmountAtomic ?? ZERO),
        item.stakedToken.metadata.decimals,
        item.depositExchangeRate,
        fiatToUsdRate
      );

      totalWeightedApr = totalWeightedApr.plus(new BigNumber(getCorrectApr(item.apr)).multipliedBy(depositValueInFiat));
      result.totalStakedAmountInFiat = result.totalStakedAmountInFiat.plus(depositValueInFiat);
      result.totalClaimableRewardsInFiat = result.totalClaimableRewardsInFiat.plus(
        atomicTokenAmountToFiat(
          new BigNumber(stakeRecord.claimableRewards ?? ZERO),
          item.rewardToken.metadata.decimals,
          item.earnExchangeRate,
          fiatToUsdRate
        )
      );
    });

    if (result.totalStakedAmountInFiat.isGreaterThan(ZERO)) {
      result.netApr = totalWeightedApr.dividedBy(result.totalStakedAmountInFiat);
    }

    return result;
  }, [earnOpportunities, someStakesWereLoading, userStakes, fiatToUsdRate]);
};

const getCorrectApr = (apr: string | null) => (isDefined(apr) && apr !== 'NaN' ? apr : ZERO);
