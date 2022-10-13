import { useContext, useEffect, useState } from 'react';

import { CurrentRouteNameContext } from '../navigator/current-route-name.context';
import { useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { useActiveTimer } from './use-active-timer.hook';

const FIXED_TIME = 2000;
const VARIABLE_TIME = 2000;

export const useRefresh = () => {
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

  return {
    isRefreshing,
    handleRefresh
  };
};
