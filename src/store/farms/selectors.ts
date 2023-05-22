import { useMemo } from 'react';

import { FarmVersionEnum } from 'src/apis/quipuswap/types';

import { useSelector } from '../selector';

export const useFarmsLoadingSelector = () => useSelector(({ farms }) => farms.allFarms.isLoading);

export const useFarmSelector = (id: string, version: FarmVersionEnum) => {
  const list = useSelector(({ farms }) => farms.allFarms.data);

  return useMemo(() => list.find(({ item }) => item.id === id && item.version === version), [list, id, version]);
};

export const useStakeSelector = (farmAddress: string) => useSelector(({ farms }) => farms.lastStakes[farmAddress]);

export const useAllFarmsSelector = () => useSelector(({ farms }) => farms.allFarms);
export const useLastStakesSelector = () => useSelector(({ farms }) => farms.lastStakes);
