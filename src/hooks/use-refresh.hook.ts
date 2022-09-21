import { useState } from 'react';

import { useActiveTimer } from './use-active-timer.hook';

const FIXED_TIME = 2000;
const VARIABLE_TIME = 2000;

export const useRefresh = () => {
  const [isRefreshing, setRefreshing] = useState(false);
  const { activeTimer, clearActiveTimer } = useActiveTimer();

  const handleRefresh = () => {
    clearActiveTimer();
    setRefreshing(true);
    activeTimer.current = setTimeout(() => setRefreshing(false), Math.random() * VARIABLE_TIME + FIXED_TIME);
  };

  return {
    isRefreshing,
    handleRefresh
  };
};
