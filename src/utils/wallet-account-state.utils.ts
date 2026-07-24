import { AccountStateInterface, initialAccountState } from '../interfaces/account-state.interface';
import { WalletState } from '../store/wallet/wallet-state';

export const getAccountState = (wallet: WalletState, accountId: string): AccountStateInterface => ({
  ...initialAccountState,
  ...wallet.accountsStateRecord[accountId]
});
