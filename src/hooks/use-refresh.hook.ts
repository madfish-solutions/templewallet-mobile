import { useState } from 'react';

export const useRefresh = () => {
  const [isRefreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, Math.random() * 2000 + 2000);
  };

  return {
    isRefreshing,
    handleRefresh
  };
};
