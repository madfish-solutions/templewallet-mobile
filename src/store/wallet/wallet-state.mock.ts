import { DEFAULT_HD_WALLET_ID, DEFAULT_HD_WALLET_NAME } from 'src/config/wallet.const';
import { mockAccountState } from 'src/interfaces/account-state.interface.mock';
import { mockHdAccount } from 'src/interfaces/account.interface.mock';

import { WalletState } from './wallet-state';

export const mockWalletState: WalletState = {
  accounts: [mockHdAccount],
  accountsStateRecord: {
    [mockHdAccount.publicKeyHash]: mockAccountState
  },
  selectedAccountId: mockHdAccount.id,
  walletsSpecsRecord: {
    [DEFAULT_HD_WALLET_ID]: {
      id: DEFAULT_HD_WALLET_ID,
      name: DEFAULT_HD_WALLET_NAME,
      createdAt: 0
    }
  },
  selectedAccountPublicKeyHash: mockHdAccount.publicKeyHash
};
