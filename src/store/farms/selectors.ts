import { useMemo } from 'react';

import { PoolType } from 'src/apis/quipuswap-staking/types';

import { useSelector } from '../selector';

export const useFarmsLoadingSelector = () => useSelector(({ farms }) => farms.allFarms.isLoading);

export const useFarmSelector = (id: string, contractAddress: string) => {
  const list = useSelector(({ farms }) => farms.allFarms.data);

  return useMemo(
    () => list.find(({ item }) => item.id === id && item.contractAddress === contractAddress),
    [list, id, contractAddress]
  );
};

export const useStakeSelector = (farmAddress: string) => useSelector(({ farms }) => farms.lastStakes[farmAddress]);

const poolTypesToDisplay = [PoolType.STABLESWAP, PoolType.LIQUIDITY_BAKING];
export const useAllFarmsSelector = () => {
  const farms = useSelector(({ farms }) => farms.allFarms);

  return useMemo(() => {
    const data = farms.data.filter(
      farm => poolTypesToDisplay.includes(farm.item.type ?? PoolType.DEX_TWO) && farm.item.dailyDistribution !== '0'
    );

    return {
      data,
      isLoading: farms.isLoading,
      error: farms.error
    };
  }, [farms]);
};
export const useLastStakesSelector = () => useSelector(({ farms }) => farms.lastStakes);

export const useStakesLoadingSelector = () => useSelector(({ farms }) => farms.stakesLoading);
