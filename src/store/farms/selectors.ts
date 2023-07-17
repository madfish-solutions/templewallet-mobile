import { useMemo } from 'react';

import { earnOpportunitiesTypesToDisplay } from 'src/config/earn-opportunities';
import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';

import { useSelector } from '../selector';

export const useFarmsLoadingSelector = () => useSelector(({ farms }) => farms.allFarms.isLoading);

export const useFarmSelector = (id: string, contractAddress: string) => {
  const list = useSelector(({ farms }) => farms.allFarms.data);

  return useMemo(
    () => list.find(({ item }) => item.id === id && item.contractAddress === contractAddress),
    [list, id, contractAddress]
  );
};

export const useFarmStakeSelector = (farmAddress: string) => useSelector(({ farms }) => farms.lastStakes[farmAddress]);

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
export const useLastFarmsStakesSelector = () => useSelector(({ farms }) => farms.lastStakes);

export const useStakesLoadingSelector = () => useSelector(({ farms }) => farms.stakesLoading);

export const useFarmStoreSelector = () => useSelector(({ farms }) => farms);
