import { DependencyList, useEffect } from 'react';

import { useCallbackRef } from './use-callback-ref';

export const useInterval = (
  callback: EmptyFn,
  refreshInterval: number,
  deps: DependencyList = [],
  shouldCallImmediately = true
) => {
  const callbackRef = useCallbackRef(callback);

  useEffect(() => {
    if (shouldCallImmediately) {
      callbackRef.current();
    }

    const interval = setInterval(() => callbackRef.current(), refreshInterval);

    return () => clearInterval(interval);
  }, deps);
};
