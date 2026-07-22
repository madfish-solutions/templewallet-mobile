import { useMemo } from 'react';

import { useAccountsListSelector } from 'src/store/wallet/wallet-selectors';

/**
 * Promo payouts are tied to the wallet's original Tezos account, rather than
 * the account currently selected in the UI.
 */
export const useRewardsAddress = (): string | undefined => {
  const accounts = useAccountsListSelector();

  return useMemo(() => accounts.at(0)?.publicKeyHash, [accounts]);
};
