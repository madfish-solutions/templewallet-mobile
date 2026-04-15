import { mockAccountState } from 'src/interfaces/account-state.interface.mock';
import { mockHdAccount } from 'src/interfaces/account.interface.mock';

import { WalletState } from './wallet-state';

export const mockWalletState: WalletState = {
  accounts: [mockHdAccount],
  accountsStateRecord: {
    [mockHdAccount.publicKeyHash]: mockAccountState
  },
  selectedAccountPublicKeyHash: mockHdAccount.publicKeyHash
};
