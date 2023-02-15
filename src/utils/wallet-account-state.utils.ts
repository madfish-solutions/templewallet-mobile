import { AccountStateInterface, initialAccountState } from 'src/interfaces/account-state.interface';
import { AccountInterface, initialAccount } from 'src/interfaces/account.interface';
import { WalletState } from 'src/store/wallet/wallet-state';

export const getSelectedAccount = (wallet: WalletState): AccountInterface => ({
  ...initialAccount,
  ...wallet.accounts.find(({ publicKeyHash }) => publicKeyHash === wallet.selectedAccountPublicKeyHash)
});

export const getAccountState = (wallet: WalletState, publicKeyHash: string): AccountStateInterface => ({
  ...initialAccountState,
  ...wallet.accountsStateRecord[publicKeyHash]
});
