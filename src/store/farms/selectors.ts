import { useMemo } from 'react';

import { poolTypesToDisplay } from 'src/config/staking';
import { FarmPoolTypeEnum } from 'src/enums/farm-pool-type.enum';

import { useSelector } from '../selector';

export const useFarmsLoadingSelector = () => useSelector(({ farms }) => farms.allFarms.isLoading);

export const useFarmSelector = (id: string, contractAddress: string) => {
  const list = useSelector(({ farms }) => farms.allFarms.data);

  return useMemo(
    () => list.find(({ item }) => item.id === id && item.contractAddress === contractAddress),
    [list, id, contractAddress]
  );
};

export const useStakeSelector = (farmAddress: string) => useSelector(({ farms }) => farms.lastStakes.data[farmAddress]);

export const useAllFarmsSelector = () => {
  const farms = useSelector(({ farms }) => farms.allFarms);

  return useMemo(() => {
    const data = farms.data.filter(
      farm =>
        poolTypesToDisplay.includes(farm.item.type ?? FarmPoolTypeEnum.DEX_TWO) && farm.item.dailyDistribution !== '0'
    );

    return {
      data,
      isLoading: farms.isLoading,
      error: farms.error
    };
  }, [farms]);
};
export const useLastStakesSelector = () => useSelector(({ farms }) => farms.lastStakes.data);

export const useStakesLoadingSelector = () => useSelector(({ farms }) => farms.lastStakes.isLoading);

export const useFarmStoreSelector = () => useSelector(({ farms }) => farms);
export const useFarmSortFieldSelector = () => useSelector(({ farms }) => farms.sortField);
