import { isEqual } from 'lodash-es';
import { useMemo } from 'react';

import { earnOpportunitiesTypesToDisplay } from 'src/config/earn-opportunities';
import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';

import { useSelector } from '../selector';

export const useFarmsLoadingSelector = () => useSelector(({ farms }) => farms.allFarms.isLoading);

export const useFarm = (id: string, contractAddress: string) => {
  const list = useSelector(({ farms }) => farms.allFarms.data);

  return useMemo(() => {
    const sameContractFarms = list.filter(({ item }) => item.contractAddress === contractAddress);

    // IDs of the same farms from Quipuswap API may differ
    if (sameContractFarms.length === 1) {
      return sameContractFarms[0];
    }

    return sameContractFarms.find(({ item }) => item.id === id);
  }, [list, id, contractAddress]);
};

export const useFarmStakeSelector = (farmAddress: string): UserStakeValueInterface | undefined =>
  useSelector(({ farms, wallet }) => farms.lastStakes[wallet.selectedAccountPublicKeyHash]?.[farmAddress]?.data);

export const useAllFarms = () => {
  const allFarms = useSelector(({ farms }) => farms.allFarms);

  return useMemo(() => {
    const data = allFarms.data.filter(
      farm =>
        earnOpportunitiesTypesToDisplay.includes(farm.item.type ?? EarnOpportunityTypeEnum.DEX_TWO) &&
        farm.item.dailyDistribution !== '0'
    );

    return {
      data,
      isLoading: allFarms.isLoading,
      error: allFarms.error
    };
  }, [allFarms]);
};

export const useLastFarmsStakesSelector = () =>
  useSelector(({ farms, wallet }) => {
    const rawStakes = farms.lastStakes[wallet.selectedAccountPublicKeyHash] ?? {};

    return Object.fromEntries(Object.entries(rawStakes).map(([key, { data }]) => [key, data]));
  }, isEqual);

export const useFarmsStakesLoadingSelector = () =>
  useSelector(({ farms, wallet }) => {
    const accountStakes = farms.lastStakes[wallet.selectedAccountPublicKeyHash] ?? {};

    return Object.values(accountStakes).some(({ isLoading }) => isLoading);
  });

export const useFarmsStakesWereLoadingSelector = () =>
  useSelector(({ farms, wallet }) => {
    const accountStakes = farms.lastStakes[wallet.selectedAccountPublicKeyHash] ?? {};

    return Object.values(accountStakes).every(({ wasLoading }) => wasLoading);
  });

export const useFarmStakeWasLoadingSelector = (farmAddress: string) => {
  const farmStake = useSelector(
    ({ farms, wallet }) => farms.lastStakes[wallet.selectedAccountPublicKeyHash]?.[farmAddress]
  );

  return farmStake?.wasLoading ?? false;
};

export const useFarmSortFieldSelector = () => useSelector(({ farms }) => farms.sortField);
