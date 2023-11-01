import { AccountStateInterface, initialAccountState } from '../interfaces/account-state.interface';
import { AccountInterface, initialAccount } from '../interfaces/account.interface';
import { WalletState } from '../store/wallet/wallet-state';

/** @deprecated */
export const getSelectedAccount = (wallet: WalletState): AccountInterface => ({
  ...initialAccount,
  ...wallet.accounts.find(({ publicKeyHash }) => publicKeyHash === wallet.selectedAccountPublicKeyHash)
});

/** @deprecated */
export const getAccountState = (wallet: WalletState, publicKeyHash: string): AccountStateInterface => ({
  ...initialAccountState,
  ...wallet.accountsStateRecord[publicKeyHash]
});
