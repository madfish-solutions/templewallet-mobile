import { useMemo } from 'react';

import { useAllFarmsSelector, useLastFarmsStakesSelector } from 'src/store/farms/selectors';

import { useEarnOpportunitiesStats } from './use-earn-opportunities-stats';

export const useUserFarmingStats = () => {
  const allFarms = useAllFarmsSelector();
  const lastStakes = useLastFarmsStakesSelector();
  const farms = useMemo(() => allFarms.data.map(({ item }) => item), [allFarms.data]);

  return useEarnOpportunitiesStats(farms, lastStakes);
};
