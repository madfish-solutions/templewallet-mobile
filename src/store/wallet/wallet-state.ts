import { WalletAccountStateInterface } from '../../interfaces/wallet-account-state.interface';

export interface WalletState {
  accounts: WalletAccountStateInterface[];
  selectedAccountPublicKeyHash: string;
}

export const walletInitialState: WalletState = {
  accounts: [],
  selectedAccountPublicKeyHash: ''
};

export interface WalletRootState {
  wallet: WalletState;
}
