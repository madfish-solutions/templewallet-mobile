import { useMemo } from 'react';

import { useAllAccounts } from 'src/store/wallet/wallet-selectors.ts';
import { getAccountAddressForTezos } from 'src/utils/account.utils.ts';

export const useRewardsAddress = (): string | undefined => {
  const accounts = useAllAccounts();

  return useMemo(() => getAccountAddressForTezos(accounts[0]), [accounts]);
};
