import { DependencyList, useEffect, useRef } from 'react';

import { useIsAuthorisedSelector } from 'src/store/wallet/wallet-selectors';

export const useAuthorisedInterval = (
  callback: EmptyFn,
  refreshInterval: number,
  deps: DependencyList = [],
  callImmediately = true
) => {
  const isAuthorised = useIsAuthorisedSelector();
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!isAuthorised) {
      return;
    }

    if (callImmediately) {
      callbackRef.current();
    }

    const interval = setInterval(() => void callbackRef.current(), refreshInterval);

    return () => clearInterval(interval);
  }, [isAuthorised, ...deps]);
};
