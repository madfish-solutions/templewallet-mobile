import { mockAccountState } from '../../interfaces/account-state.interface.mock';
import { mockHdAccount } from '../../interfaces/account.interface.mock';

import { WalletState } from './wallet-state';

export const mockWalletState: WalletState = {
  accounts: [mockHdAccount],
  accountsStateRecord: {
    [mockHdAccount.publicKeyHash]: mockAccountState
  },
  selectedAccountPublicKeyHash: mockHdAccount.publicKeyHash
};
