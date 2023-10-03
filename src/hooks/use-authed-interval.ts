import { DependencyList, useEffect } from 'react';

import { EmptyFn } from 'src/config/general';
import { useIsAuthorisedSelector } from 'src/store/wallet/wallet-selectors';

export const useAuthorisedInterval = (callback: EmptyFn, refreshInterval: number, deps: DependencyList = []) => {
  const isAuthorised = useIsAuthorisedSelector();

  useEffect(() => {
    if (!isAuthorised) {
      return;
    }
    callback();

    const interval = setInterval(callback, refreshInterval);

    return () => clearInterval(interval);
  }, [isAuthorised, ...deps]);
};
