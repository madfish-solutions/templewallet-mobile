import { FarmVersionEnum } from 'src/apis/quipuswap-staking/types';

import { useSelector } from '../selector';

export const useFarmsSelector = () => useSelector(({ farms }) => farms.farms.data.list.map(({ item }) => item));

export const useFarmsLoadingSelector = () => useSelector(({ farms }) => farms.farms.isLoading);

export const useFarmsErrorSelector = () => useSelector(({ farms }) => farms.farms.error);

/* export const useLowestFarmBlockLevelSelector = () =>
  useSelector(({ farms }) => {
    const { list } = farms.items.data;
    if (list.length === 0) {
      return undefined;
    }

    return Math.min(...list.map(({ blockInfo }) => blockInfo.level));
  }); */

export const useFarmSelector = (id: string, version: FarmVersionEnum) =>
  useSelector(({ farms }) => {
    const { list } = farms.farms.data;

    return list.find(({ item }) => item.id === id && item.version === version);
  });
