import { useState } from 'react';
import { RefreshControlProps } from 'react-native';

import { useActiveTimer } from './use-active-timer.hook';

const FIXED_TIME = 1000;
const VARIABLE_TIME = 1000;

export const useFakeRefreshControlProps = (): RefreshControlProps => {
  const [isRefreshing, setRefreshing] = useState(false);
  const { activeTimer, clearActiveTimer } = useActiveTimer();

  const handleRefresh = () => {
    clearActiveTimer();
    setRefreshing(true);
    activeTimer.current = setTimeout(() => setRefreshing(false), Math.random() * VARIABLE_TIME + FIXED_TIME);
  };

  return { refreshing: isRefreshing, onRefresh: handleRefresh };
};
