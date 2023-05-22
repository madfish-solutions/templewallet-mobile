import { useMemo } from 'react';

import { FarmVersionEnum, PoolType } from 'src/apis/quipuswap-staking/types';

import { useSelector } from '../selector';

export const useFarmsLoadingSelector = () => useSelector(({ farms }) => farms.farms.isLoading);

export const useFarmSelector = (id: string, version: FarmVersionEnum) => {
  const list = useSelector(({ farms }) => farms.farms.data.list);

  return useMemo(() => list.find(({ item }) => item.id === id && item.version === version), [list, id, version]);
};

export const useAllFarmsSelector = () =>
  useSelector(({ farms }) => {
    const data = farms.allFarms.data.filter(farm => farm.item.type === PoolType.STABLESWAP);

    return {
      data,
      isLoading: farms.allFarms.isLoading,
      error: farms.allFarms.error
    };
  });
export const useLastStakesSelector = () => useSelector(({ farms }) => farms.lastStakes);
