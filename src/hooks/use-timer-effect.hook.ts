import { DependencyList, useEffect } from 'react';

import { EmptyFn } from '../config/general';
import { useIsAuthorisedSelector } from '../store/wallet/wallet-selectors';

const effect = (callback: EmptyFn, refreshInterval: number) => {
  callback();

  let timeoutId = setTimeout(function updateData() {
    callback();
    timeoutId = setTimeout(updateData, refreshInterval);
  }, refreshInterval);

  return () => clearTimeout(timeoutId);
};

export const useTimerEffect = (callback: EmptyFn, refreshInterval: number, deps: DependencyList = []) =>
  useEffect(() => effect(callback, refreshInterval), [...deps]);

export const useAuthorisedTimerEffect = (callback: EmptyFn, refreshInterval: number, deps: DependencyList = []) => {
  const isAuthorised = useIsAuthorisedSelector();

  useEffect(() => {
    if (isAuthorised) {
      effect(callback, refreshInterval);
    }
  }, [isAuthorised, ...deps]);
};
