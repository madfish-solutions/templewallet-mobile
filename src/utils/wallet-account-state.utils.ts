import { AccountStateInterface, initialAccountState } from '../interfaces/account-state.interface';
import { AccountInterface, initialAccount } from '../interfaces/account.interface';
import { WalletState } from '../store/wallet/wallet-state';

import { getAccountAddressForTezos, getSelectedAccountFromWallet } from './account.utils';

/** @deprecated */
export const getSelectedAccount = (wallet: WalletState): AccountInterface => ({
  ...initialAccount,
  ...getSelectedAccountFromWallet(wallet)
});

/** @deprecated */
export const getAccountState = (wallet: WalletState, publicKeyHash: string): AccountStateInterface => ({
  ...initialAccountState,
  ...wallet.accountsStateRecord[
    getAccountAddressForTezos(
      wallet.accounts.find(account => account.publicKeyHash === publicKeyHash || account.id === publicKeyHash) ??
        initialAccount
    ) ?? publicKeyHash
  ]
});
