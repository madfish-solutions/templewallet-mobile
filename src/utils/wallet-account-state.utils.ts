import { WalletAccountStateInterface } from '../interfaces/wallet-account-state.interface';

export const walletAccountStateToWalletAccount = (state: WalletAccountStateInterface) => {
  const { name, publicKey, publicKeyHash, tezosBalance, tokensList } = state;

  return { name, publicKey, publicKeyHash, tezosBalance, tokensList };
};
