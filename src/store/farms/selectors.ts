import { useMemo } from 'react';

import { earnOpportunitiesTypesToDisplay } from 'src/config/earn-opportunities';
import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { nullableEntityWasLoading } from 'src/utils/earn-opportunities/entity.utils';
import { isDefined } from 'src/utils/is-defined';

import { useSelector } from '../selector';

export const useAllFarmsWereLoadingSelector = () =>
  useSelector(({ farms }) =>
    Object.values(farms.allFarms).every(({ data, error }) => data.length > 0 || isDefined(error))
  );

export const useFarmsLoadingSelector = () =>
  useSelector(({ farms }) => Object.values(farms.allFarms).some(({ isLoading }) => isLoading));

export const useFarm = (id: string, contractAddress: string) => {
  const allFarms = useSelector(({ farms }) => farms.allFarms);

  return useMemo(() => {
    const sameContractFarms = Object.values(allFarms)
      .map(({ data }) => data)
      .flat()
      .filter(({ item }) => item.contractAddress === contractAddress);

    // IDs of the same farms from Quipuswap API may differ
    if (sameContractFarms.length === 1) {
      return sameContractFarms[0];
    }

    return sameContractFarms.find(({ item }) => item.id === id);
  }, [allFarms, id, contractAddress]);
};

export const useFarmStakeSelector = (farmAddress: string): UserStakeValueInterface | undefined =>
  useSelector(
    ({ farms, wallet }) => farms.lastStakes[wallet.selectedAccountPublicKeyHash]?.[farmAddress]?.data ?? undefined
  );

export const useAllFarms = () => {
  const allFarmsStates = useSelector(({ farms }) => farms.allFarms);

  return useMemo(
    () =>
      Object.values(allFarmsStates)
        .map(({ data }) => data.map(({ item }) => item))
        .flat()
        .filter(
          farm =>
            earnOpportunitiesTypesToDisplay.includes(farm.type ?? EarnOpportunityTypeEnum.DEX_TWO) &&
            farm.dailyDistribution !== '0'
        ),
    [allFarmsStates]
  );
};

export const useLastFarmsStakes = () => {
  const rawStakes = useSelector(({ farms, wallet }) => farms.lastStakes[wallet.selectedAccountPublicKeyHash]);

  return useMemo(
    () => Object.fromEntries(Object.entries(rawStakes ?? {}).map(([key, { data }]) => [key, data ?? undefined])),
    [rawStakes]
  );
};

export const useFarmsStakesLoadingSelector = () =>
  useSelector(({ farms, wallet }) => {
    const accountStakes = farms.lastStakes[wallet.selectedAccountPublicKeyHash] ?? {};

    return Object.values(accountStakes).some(({ isLoading }) => isLoading);
  });

export const useSomeFarmsStakesWereLoadingSelector = () =>
  useSelector(({ farms, wallet }) => {
    const accountStakes = farms.lastStakes[wallet.selectedAccountPublicKeyHash] ?? {};

    return Object.values(accountStakes).some(nullableEntityWasLoading);
  });

export const useFarmStakeWasLoadingSelector = (farmAddress: string) =>
  useSelector(({ farms, wallet }) =>
    nullableEntityWasLoading(farms.lastStakes[wallet.selectedAccountPublicKeyHash]?.[farmAddress])
  );

export const useFarmSortFieldSelector = () => useSelector(({ farms }) => farms.sortField);
