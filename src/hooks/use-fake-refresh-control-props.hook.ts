import { useContext, useEffect, useState } from 'react';
import { RefreshControlProps } from 'react-native';

import { CurrentRouteNameContext } from '../navigator/current-route-name.context';
import { useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { useActiveTimer } from './use-active-timer.hook';

const FIXED_TIME = 1000;
const VARIABLE_TIME = 1000;

export const useFakeRefreshControlProps = (): RefreshControlProps => {
  const [isRefreshing, setRefreshing] = useState(false);
  const { activeTimer, clearActiveTimer } = useActiveTimer();
  const currentRouteName = useContext(CurrentRouteNameContext);
  const { publicKeyHash } = useSelectedAccountSelector();

  const handleRefresh = () => {
    clearActiveTimer();
    setRefreshing(true);
    activeTimer.current = setTimeout(() => setRefreshing(false), Math.random() * VARIABLE_TIME + FIXED_TIME);
  };

  useEffect(() => {
    setRefreshing(false);
    clearActiveTimer();
  }, [publicKeyHash, currentRouteName]);

  return { refreshing: isRefreshing, onRefresh: handleRefresh };
};