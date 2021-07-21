import { DependencyList, useEffect } from 'react';

import { EmptyFn } from '../config/general';
import { useIsAuthorisedSelector } from '../store/wallet/wallet-selectors';

export const useAuthorisedTimerEffect = (callback: EmptyFn, refreshInterval: number, deps: DependencyList = []) => {
  const isAuthorised = useIsAuthorisedSelector();

  useEffect(() => {
    if (isAuthorised) {
      callback();

      let timeoutId = setTimeout(function updateData() {
        callback();
        timeoutId = setTimeout(updateData, refreshInterval);
      }, refreshInterval);

      return () => clearTimeout(timeoutId);
    }
  }, [isAuthorised, ...[deps]]);
};
