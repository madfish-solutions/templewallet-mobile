import { DependencyList, useEffect } from 'react';

import { useCallbackRef } from './use-callback-ref';

export const useTimeout = (callback: EmptyFn, time: number, deps: DependencyList = []) => {
  const callbackRef = useCallbackRef(callback);

  useEffect(() => {
    const timeout = setTimeout(() => callbackRef.current(), time);

    return () => void clearTimeout(timeout);
  }, deps);
};
