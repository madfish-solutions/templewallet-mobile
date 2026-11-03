import { useCallback, useMemo, useState } from 'react';
import { RefreshControlProps } from 'react-native';
import { useDispatch } from 'react-redux';

import { loadAssetsBalancesActions, loadTezosBalanceActions } from 'src/store/wallet/wallet-actions';

export const useBalancesRefreshControlProps = (refreshEtherlink: () => Promise<void>): RefreshControlProps => {
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    dispatch(loadTezosBalanceActions.submit());
    dispatch(loadAssetsBalancesActions.submit());

    setIsRefreshing(true);
    void refreshEtherlink()
      .catch(console.error)
      .finally(() => setIsRefreshing(false));
  }, [dispatch, refreshEtherlink]);

  return useMemo(() => ({ refreshing: isRefreshing, onRefresh: handleRefresh }), [isRefreshing, handleRefresh]);
};
