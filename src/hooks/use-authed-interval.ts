import { DependencyList, useEffect } from 'react';

import { useIsAuthorisedSelector } from 'src/store/wallet/wallet-selectors';
import { useCallbackRef } from 'src/utils/hooks';

export const useAuthorisedInterval = (
  callback: EmptyFn,
  refreshInterval: number,
  deps: DependencyList = [],
  callImmediately = true
) => {
  const isAuthorised = useIsAuthorisedSelector();
  const callbackRef = useCallbackRef(callback);

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
