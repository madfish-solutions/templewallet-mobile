import { mockHdAccount } from '../../interfaces/account.interface.mock';
import { mockWalletAccountState } from '../../interfaces/wallet-account-state.interface.mock';
import { WalletState } from './wallet-state';

export const mockWalletState: WalletState = {
  accounts: [mockWalletAccountState],
  selectedAccountPublicKeyHash: mockHdAccount.publicKeyHash
};
