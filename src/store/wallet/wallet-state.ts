import { AccountInterface } from '../../interfaces/account.interface';

export interface WalletState {
  hdAccounts: AccountInterface[];
  selectedAccount?: AccountInterface;
}

export const walletInitialState: WalletState = {
  hdAccounts: []
};

export interface WalletRootState {
  wallet: WalletState;
}
