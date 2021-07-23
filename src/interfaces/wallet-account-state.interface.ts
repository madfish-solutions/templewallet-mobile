import { AccountStateInterface, emptyAccountState, initialAccountState } from './account-state.interface';
import { AccountInterface, emptyAccount, initialAccount } from './account.interface';

export type WalletAccountStateInterface = AccountInterface & AccountStateInterface;

export const initialWalletAccountState: WalletAccountStateInterface = {
  ...initialAccount,
  ...initialAccountState
};

export const emptyWalletAccountState: WalletAccountStateInterface = {
  ...emptyAccount,
  ...emptyAccountState
};
