import { AccountStateInterface } from 'src/interfaces/account-state.interface';
import { Account } from 'src/interfaces/account.interfaces';

import { LegacyWalletState } from './legacy-wallet-state.interface.ts';

type AccountId = string;

export interface WalletState extends LegacyWalletState {
  accounts: Account[];
  accountsStateRecord: Record<AccountId, AccountStateInterface>;
  selectedAccountId: string;
}

export const walletInitialState: WalletState = {
  accounts: [],
  accountsStateRecord: {},
  selectedAccountId: ''
};
