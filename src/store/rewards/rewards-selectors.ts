import { useSelector } from '../selector';

export const useTkeyRewardsStatsSelector = () => useSelector(state => state.rewards.tkeyStats.data);

export const useIsTkeyRewardsStatsLoadingSelector = () => useSelector(state => state.rewards.tkeyStats.isLoading);
