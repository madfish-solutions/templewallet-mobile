import { DependencyList, useEffect } from 'react';

import { EmptyFn } from '../config/general';
import { useIsAuthorisedSelector } from '../store/wallet/wallet-selectors';

export const useTimerEffect = (callback: EmptyFn, refreshInterval: number, deps: DependencyList = []) =>
  useEffect(() => {
    callback();

    const interval = setInterval(callback, refreshInterval);

    return () => clearInterval(interval);
  }, [...deps]);

export const useAuthorisedTimerEffect = (callback: EmptyFn, refreshInterval: number, deps: DependencyList = []) => {
  const isAuthorised = useIsAuthorisedSelector();

  useEffect(() => {
    if (isAuthorised) {
      callback();

      const interval = setInterval(callback, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [isAuthorised, ...deps]);
};
