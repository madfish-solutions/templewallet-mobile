import { DependencyList, useEffect } from 'react';

import { EmptyFn } from 'src/config/general';
import { useIsAuthorisedSelector } from 'src/store/wallet/wallet-selectors';

export const useInterval = (
  callback: EmptyFn,
  refreshInterval: number,
  deps: DependencyList = [],
  shouldCallImmediately = true
) =>
  useEffect(() => {
    if (shouldCallImmediately) {
      callback();
    }

    const interval = setInterval(callback, refreshInterval);

    return () => clearInterval(interval);
  }, deps);

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
