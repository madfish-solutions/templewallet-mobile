import { useMemo } from 'react';

import { FarmVersionEnum } from 'src/apis/quipuswap-staking/types';
import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';

import { useSelector } from '../selector';

export const useFarmsLoadingSelector = () => useSelector(({ farms }) => farms.allFarms.isLoading);

export const useFarmSelector = (id: string, version: FarmVersionEnum) => {
  const list = useSelector(({ farms }) => farms.allFarms.data);

  return useMemo(() => list.find(({ item }) => item.id === id && item.version === version), [list, id, version]);
};

export const useStakeSelector = (farmAddress: string) => useSelector(({ farms }) => farms.lastStakes[farmAddress]);

export const useAllFarmsSelector = () => {
  const farms = useSelector(({ farms }) => farms.allFarms);

  return useMemo(() => {
    const data = farms.data.filter(
      farm => farm.item.type === EarnOpportunityTypeEnum.STABLESWAP && farm.item.dailyDistribution !== '0'
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

export const useFarmStoreSelector = () => useSelector(({ farms }) => farms);
