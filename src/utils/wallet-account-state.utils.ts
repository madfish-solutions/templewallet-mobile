import { WalletAccountStateInterface } from '../interfaces/wallet-account-state.interface';
import { WalletAccountInterface } from '../interfaces/wallet-account.interface';

export const walletAccountStateToWalletAccount = (state: WalletAccountStateInterface): WalletAccountInterface => {
  const { name, publicKey, publicKeyHash, tezosBalance, tokensList } = state;

  return { name, publicKey, publicKeyHash, tezosBalance, tokensList };
};
