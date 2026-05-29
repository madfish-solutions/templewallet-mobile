import { WalletState } from 'src/store/wallet/wallet-state.ts';

export const getSelectedAccountFromWallet = (wallet: WalletState) =>
  wallet.accounts.find(account => account.id === wallet.selectedAccountId) ?? wallet.accounts[0];
