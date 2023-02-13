import { useMemo } from 'react';

import { AccountStateInterface, initialAccountState } from 'src/interfaces/account-state.interface';
import { AccountInterface, initialAccount } from 'src/interfaces/account.interface';
import { useSelector } from 'src/store/selector';
import { WalletState } from 'src/store/wallet/wallet-state';

export const getSelectedAccount = (wallet: WalletState): AccountInterface => ({
  ...initialAccount,
  ...wallet.accounts.find(({ publicKeyHash }) => publicKeyHash === wallet.selectedAccountPublicKeyHash)
});

export const getAccountState = (wallet: WalletState, publicKeyHash: string): AccountStateInterface => ({
  ...initialAccountState,
  ...wallet.accountsStateRecord[publicKeyHash]
});

export const useSelectedAccountState = (): AccountStateInterface => {
  const walletAccountsStateRecord = useSelector(state => state.wallet.accountsStateRecord);
  const selectedAccountPublicKeyHash = useSelector(state => state.wallet.selectedAccountPublicKeyHash);

  return useMemo(
    () => ({
      ...initialAccountState,
      ...walletAccountsStateRecord[selectedAccountPublicKeyHash]
    }),
    [walletAccountsStateRecord, selectedAccountPublicKeyHash]
  );
};
