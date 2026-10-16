import { AccountStateInterface } from 'src/interfaces/account-state.interface';
import { Account } from 'src/interfaces/account.interfaces';

type AccountId = string;

export interface WalletState {
  accounts: Account[];
  accountsStateRecord: Record<AccountId, AccountStateInterface>;
  selectedAccountId: string;
}

export const walletInitialState: WalletState = {
  accounts: [],
  accountsStateRecord: {},
  selectedAccountId: ''
};
