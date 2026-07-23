import { useMemo } from 'react';

import { useAccountsListSelector } from 'src/store/wallet/wallet-selectors';

export const useRewardsAddress = (): string | undefined => {
  const accounts = useAccountsListSelector();

  return useMemo(() => accounts.at(0)?.publicKeyHash, [accounts]);
};
