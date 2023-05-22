import { FarmVersionEnum } from 'src/apis/quipuswap/types';

import { useSelector } from '../selector';

export const useFarmsLoadingSelector = () => useSelector(({ farms }) => farms.allFarms.isLoading);

export const useFarmSelector = (id: string, version: FarmVersionEnum) =>
  useSelector(({ farms }) => farms.allFarms.data.find(({ item }) => item.id === id && item.version === version));

export const useStakeSelector = (farmAddress: string) => useSelector(({ farms }) => farms.lastStakes[farmAddress]);

export const useAllFarmsSelector = () => useSelector(({ farms }) => farms.allFarms);
export const useLastStakesSelector = () => useSelector(({ farms }) => farms.lastStakes);
