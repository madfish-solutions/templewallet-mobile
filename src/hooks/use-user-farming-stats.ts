import { useMemo } from 'react';

import { useAllFarms, useFarmsStakesWereLoadingSelector, useLastFarmsStakesSelector } from 'src/store/farms/selectors';

import { useEarnOpportunitiesStats } from './use-earn-opportunities-stats';

export const useUserFarmingStats = () => {
  const allFarms = useAllFarms();
  const lastStakes = useLastFarmsStakesSelector();
  const farms = useMemo(() => allFarms.data.map(({ item }) => item), [allFarms.data]);
  const stakesWereLoading = useFarmsStakesWereLoadingSelector();

  return useEarnOpportunitiesStats(farms, lastStakes, stakesWereLoading);
};
