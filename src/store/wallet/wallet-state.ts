import { AccountStateInterface } from '../../interfaces/account-state.interface';
import { AccountInterface } from '../../interfaces/account.interface';

export interface WalletState {
  accounts: AccountInterface[];
  accountsStateRecord: Record<string, AccountStateInterface>;
  selectedAccountPublicKeyHash: string;
}

export const walletInitialState: WalletState = {
  accounts: [],
  accountsStateRecord: {},
  selectedAccountPublicKeyHash: ''
};

export interface WalletRootState {
  wallet: WalletState;
}
