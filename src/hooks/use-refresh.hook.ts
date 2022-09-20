import { useEffect, useRef, useState } from 'react';

import { isDefined } from '../utils/is-defined';

export const useRefresh = () => {
  const [isRefreshing, setRefreshing] = useState(false);

  const timerRef = useRef<NodeJS.Timeout>();

  const handleRefresh = () => {
    setRefreshing(true);
    timerRef.current = setTimeout(() => {
      setRefreshing(false);
    }, Math.random() * 2000 + 2000);
  };

  useEffect(() => {
    return () => {
      if (isDefined(timerRef.current)) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    isRefreshing,
    handleRefresh
  };
};
