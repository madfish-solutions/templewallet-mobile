import { useMemo } from 'react';

import { earnOpportunitiesTypesToDisplay } from 'src/config/earn-opportunities';
import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';

import { useSelector } from '../selector';

export const useFarmsLoadingSelector = () => useSelector(({ farms }) => farms.allFarms.isLoading);

export const useFarmSelector = (id: string, contractAddress: string) => {
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

export const useFarmStakeSelector = (farmAddress: string) =>
  useSelector(({ farms }) => farms.lastStakes.data[farmAddress]);

export const useAllFarmsSelector = () => {
  const farms = useSelector(({ farms }) => farms.allFarms);

  return useMemo(() => {
    const data = farms.data.filter(
      farm =>
        earnOpportunitiesTypesToDisplay.includes(farm.item.type ?? EarnOpportunityTypeEnum.DEX_TWO) &&
        farm.item.dailyDistribution !== '0'
    );

    return {
      data,
      isLoading: farms.isLoading,
      error: farms.error
    };
  }, [farms]);
};

export const useLastFarmsStakesSelector = () => useSelector(({ farms }) => farms.lastStakes.data);

export const useFarmsStakesLoadingSelector = () => useSelector(({ farms }) => farms.lastStakes.isLoading);

export const useFarmSortFieldSelector = () => useSelector(({ farms }) => farms.sortField);
