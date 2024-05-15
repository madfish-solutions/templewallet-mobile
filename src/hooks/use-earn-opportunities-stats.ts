import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';

import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';
import { EarnOpportunity } from 'src/types/earn-opportunity.types';
import { atomicTokenAmountToFiat } from 'src/utils/fiat.utils';
import { isDefined } from 'src/utils/is-defined';
import { ZERO } from 'src/utils/number.util';

const numberIsValid = (value: string | null): value is `${number}` => isDefined(value) && !isNaN(Number(value));

interface ReadyStakeEarnOpportunitiesStats {
  netApr: BigNumber | undefined;
  totalStakedAmountInFiat: BigNumber;
  totalClaimableRewardsInFiat: BigNumber;
  maxApr: BigNumber | undefined;
}

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

    const validAprValues = earnOpportunities.map(item => item.apr).filter(numberIsValid);
    const maxApr = validAprValues.length === 0 ? undefined : BigNumber.maximum(ZERO, ...validAprValues);

    if (!someStakesWereLoading) {
      return {
        netApr: undefined,
        totalStakedAmountInFiat: undefined,
        totalClaimableRewardsInFiat: undefined,
        maxApr
      };
    }

    const result: ReadyStakeEarnOpportunitiesStats = {
      netApr: undefined,
      totalStakedAmountInFiat: ZERO,
      totalClaimableRewardsInFiat: ZERO,
      maxApr
    };

    let netAprNumerator = ZERO;
    let netAprDenominator = ZERO;

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

      const weightedAprSummand = new BigNumber(item.apr ?? '').multipliedBy(depositValueInFiat);

      if (!weightedAprSummand.isNaN()) {
        netAprNumerator = netAprNumerator.plus(weightedAprSummand);
        netAprDenominator = netAprDenominator.plus(depositValueInFiat);
      }

      if (!depositValueInFiat.isNaN()) {
        result.totalStakedAmountInFiat = result.totalStakedAmountInFiat.plus(depositValueInFiat);
      }

      const claimableRewardsInFiat = atomicTokenAmountToFiat(
        new BigNumber(stakeRecord.claimableRewards ?? ZERO),
        item.rewardToken.metadata.decimals,
        item.earnExchangeRate,
        fiatToUsdRate
      );

      if (!claimableRewardsInFiat.isNaN()) {
        result.totalClaimableRewardsInFiat = result.totalClaimableRewardsInFiat.plus(claimableRewardsInFiat);
      }
    });

    if (netAprDenominator.isGreaterThan(ZERO)) {
      result.netApr = netAprNumerator.dividedBy(netAprDenominator);
    }

    return result;
  }, [earnOpportunities, someStakesWereLoading, userStakes, fiatToUsdRate]);
};
