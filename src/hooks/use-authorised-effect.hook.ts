import { DependencyList, useEffect } from 'react';

import { EmptyFn } from '../config/general';
import { useIsAuthorisedSelector } from '../store/wallet/wallet-selectors';

export const useAuthorisedEffect = (callback: EmptyFn, deps: DependencyList = []) => {
  const isAuthorised = useIsAuthorisedSelector();

  useEffect(() => {
    if (isAuthorised) {
      callback();
    }
  }, [isAuthorised, ...deps]);
};
