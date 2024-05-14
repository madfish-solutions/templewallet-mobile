import {
  useSavingsItems,
  useSavingsStakes,
  useSomeSavingsStakesWereLoadingSelector
} from 'src/store/savings/selectors';

import { useEarnOpportunitiesStats } from './use-earn-opportunities-stats';

export const useUserSavingsStats = () => {
  const savings = useSavingsItems();
  const stakes = useSavingsStakes();
  const someStakesWereLoading = useSomeSavingsStakesWereLoadingSelector();

  return useEarnOpportunitiesStats(savings, stakes, someStakesWereLoading);
};
