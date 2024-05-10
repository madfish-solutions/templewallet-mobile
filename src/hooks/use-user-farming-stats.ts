import {
  useAllFarms,
  useSomeFarmsStakesWereLoadingSelector,
  useLastFarmsStakesSelector
} from 'src/store/farms/selectors';

import { useEarnOpportunitiesStats } from './use-earn-opportunities-stats';

export const useUserFarmingStats = () => {
  const farms = useAllFarms();
  const lastStakes = useLastFarmsStakesSelector();
  const someStakesWereLoading = useSomeFarmsStakesWereLoadingSelector();

  return useEarnOpportunitiesStats(farms, lastStakes, someStakesWereLoading);
};
