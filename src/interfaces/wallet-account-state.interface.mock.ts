import { mockAccountState } from './account-state.interface.mock';
import { mockHdAccount } from './account.interface.mock';
import { WalletAccountStateInterface } from './wallet-account-state.interface';

export const mockWalletAccountState: WalletAccountStateInterface = {
  ...mockHdAccount,
  ...mockAccountState
};
