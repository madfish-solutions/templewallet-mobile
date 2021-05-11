import { AccountInterface, emptyAccount } from '../../interfaces/account.interface';

export interface WalletState {
  hdAccounts: AccountInterface[];
  selectedAccount: AccountInterface;
}

export const walletInitialState: WalletState = {
  hdAccounts: [],
  selectedAccount: emptyAccount
};

export interface WalletRootState {
  wallet: WalletState;
}
