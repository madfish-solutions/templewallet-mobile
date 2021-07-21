import { useEffect } from 'react';

import { useIsAuthorisedSelector, useSelectedAccountSelector } from '../store/wallet/wallet-selectors';

export const useInitDataLoadTimeout = (callback: () => void, refreshInterval: number) => {
  const isAuthorised = useIsAuthorisedSelector();
  const selectedAccount = useSelectedAccountSelector();

  useEffect(() => {
    callback();

    let timeoutId = setTimeout(function updateData() {
      callback();
      timeoutId = setTimeout(updateData, refreshInterval);
    }, refreshInterval);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isAuthorised, selectedAccount.publicKeyHash]);
};
