import { mockAccountState } from 'src/interfaces/account-state.interface.mock';
import { mockEvmImportedAccount, mockHdAccount, mockTezosImportedAccount } from 'src/interfaces/account.interface.mock';

import { addHdAccountAction, setSelectedAccountIdAction } from './wallet-actions';
import { walletReducers } from './wallet-reducers';
import { WalletState } from './wallet-state';

const stateWithAccounts: WalletState = {
  accounts: [mockHdAccount, mockTezosImportedAccount, mockEvmImportedAccount],
  accountsStateRecord: {
    [mockHdAccount.publicKeyHash]: mockAccountState,
    [mockTezosImportedAccount.publicKeyHash]: mockAccountState
  },
  selectedAccountId: mockHdAccount.id,
  walletsSpecsRecord: {}
};

describe('walletReducers account selection', () => {
  it('selects accounts by canonical account id', () => {
    const state = walletReducers(stateWithAccounts, setSelectedAccountIdAction(mockTezosImportedAccount.id));

    expect(state.selectedAccountId).toEqual(mockTezosImportedAccount.id);
  });

  it('selects EVM-only accounts by canonical account id', () => {
    const state = walletReducers(stateWithAccounts, setSelectedAccountIdAction(mockEvmImportedAccount.id));

    expect(state.selectedAccountId).toEqual(mockEvmImportedAccount.id);
  });

  it('stores submitted account id as selected account id', () => {
    const unknownAccountId = 'unknown-account-id';

    const state = walletReducers(stateWithAccounts, setSelectedAccountIdAction(unknownAccountId));

    expect(state.selectedAccountId).toEqual(unknownAccountId);
  });

  it('adds Tezos account state under the Tezos address', () => {
    const state = walletReducers(undefined, addHdAccountAction(mockHdAccount));

    expect(state.accounts[0].id).toEqual(mockHdAccount.id);
    expect(state.accountsStateRecord[mockHdAccount.publicKeyHash]).toBeDefined();
  });
});
