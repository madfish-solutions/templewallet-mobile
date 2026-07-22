import { BigNumber } from 'bignumber.js';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { loadTkeyRewardsStatsActions } from 'src/store/rewards/rewards-actions';
import { useIsTkeyRewardsStatsLoadingSelector, useTkeyRewardsStatsSelector } from 'src/store/rewards/rewards-selectors';

import { useRewardsAddress } from './use-rewards-address.hook';

export interface TkeyRewardsStats {
  lastAmount?: BigNumber;
  total: BigNumber;
}

export const useTkeyRewardsStats = () => {
  const dispatch = useDispatch();
  const rewardsAddress = useRewardsAddress();
  const storedStats = useTkeyRewardsStatsSelector();
  const isLoading = useIsTkeyRewardsStatsLoadingSelector();

  useEffect(() => {
    if (rewardsAddress) {
      dispatch(loadTkeyRewardsStatsActions.submit(rewardsAddress));
    }
  }, [dispatch, rewardsAddress]);

  const stats = useMemo(
    () =>
      storedStats
        ? {
            total: new BigNumber(storedStats.total),
            lastAmount: storedStats.lastAmount === undefined ? undefined : new BigNumber(storedStats.lastAmount)
          }
        : undefined,
    [storedStats]
  );

  return { isLoading, stats };
};
