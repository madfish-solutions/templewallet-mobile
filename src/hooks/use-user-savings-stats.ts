import { useSavingsItemsSelector, useSavingsStakesSelector } from 'src/store/savings/selectors';

import { useEarnOpportunitiesStats } from './use-earn-opportunities-stats';

export const useUserSavingsStats = () => {
  const savings = useSavingsItemsSelector();
  const stakes = useSavingsStakesSelector();

  return useEarnOpportunitiesStats(savings, stakes);
};
