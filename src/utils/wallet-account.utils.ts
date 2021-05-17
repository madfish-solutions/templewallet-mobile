import { emptyWalletAccount, WalletAccountInterface } from '../interfaces/wallet-account.interface';

export const findSelectedAccount = (accountsList: WalletAccountInterface[], selectedAccountPublicKeyHash: string) =>
  accountsList.find(({ publicKeyHash }) => publicKeyHash === selectedAccountPublicKeyHash) ?? emptyWalletAccount;
