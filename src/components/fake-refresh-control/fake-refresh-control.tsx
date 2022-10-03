import React, { useState } from 'react';

import { useActiveTimer } from '../../hooks/use-active-timer.hook';
import { RefreshControl } from '../refresh-control/refresh-control';

const FIXED_TIME = 1000;
const VARIABLE_TIME = 1000;

export const FakeRefreshControl = () => {
  const [isRefreshing, setRefreshing] = useState(false);
  const { activeTimer, clearActiveTimer } = useActiveTimer();

  const handleRefresh = () => {
    clearActiveTimer();
    setRefreshing(true);
    activeTimer.current = setTimeout(() => setRefreshing(false), Math.random() * VARIABLE_TIME + FIXED_TIME);
  };

  return <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />;
};
