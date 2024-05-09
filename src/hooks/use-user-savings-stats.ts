import {
  useSavingsItemsSelector,
  useSavingsStakesSelector,
  useSavingsStakesWereLoadingSelector
} from 'src/store/savings/selectors';

import { useEarnOpportunitiesStats } from './use-earn-opportunities-stats';

export const useUserSavingsStats = () => {
  const savings = useSavingsItemsSelector();
  const stakes = useSavingsStakesSelector();
  const stakesWereLoaded = useSavingsStakesWereLoadingSelector();

  return useEarnOpportunitiesStats(savings, stakes, stakesWereLoaded);
};
