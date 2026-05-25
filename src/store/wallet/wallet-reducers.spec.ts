import { mockAccountState } from 'src/interfaces/account-state.interface.mock';
import { mockEvmImportedAccount, mockHdAccount, mockTezosImportedAccount } from 'src/interfaces/account.interface.mock';

import { addHdAccountAction, setSelectedAccountAction } from './wallet-actions';
import { walletReducers } from './wallet-reducers';
import { WalletState } from './wallet-state';

const stateWithAccounts: WalletState = {
  accounts: [mockHdAccount, mockTezosImportedAccount, mockEvmImportedAccount],
  accountsStateRecord: {
    [mockHdAccount.publicKeyHash]: mockAccountState,
    [mockTezosImportedAccount.publicKeyHash]: mockAccountState
  },
  selectedAccountId: mockHdAccount.id,
  selectedAccountPublicKeyHash: mockHdAccount.publicKeyHash,
  walletsSpecsRecord: {}
};

describe('walletReducers account selection', () => {
  it('selects accounts by canonical account id', () => {
    const state = walletReducers(stateWithAccounts, setSelectedAccountAction(mockTezosImportedAccount.id));

    expect(state.selectedAccountId).toEqual(mockTezosImportedAccount.id);
    expect(state.selectedAccountPublicKeyHash).toEqual(mockTezosImportedAccount.publicKeyHash);
  });

  it('keeps deprecated selected pkh Tezos-compatible when selecting an EVM-only account', () => {
    const state = walletReducers(stateWithAccounts, setSelectedAccountAction(mockEvmImportedAccount.id));

    expect(state.selectedAccountId).toEqual(mockEvmImportedAccount.id);
    expect(state.selectedAccountPublicKeyHash).toEqual(mockHdAccount.publicKeyHash);
  });

  it('accepts legacy selected pkh payloads', () => {
    const state = walletReducers(
      { ...stateWithAccounts, selectedAccountId: mockEvmImportedAccount.id },
      setSelectedAccountAction(mockHdAccount.publicKeyHash)
    );

    expect(state.selectedAccountId).toEqual(mockHdAccount.id);
    expect(state.selectedAccountPublicKeyHash).toEqual(mockHdAccount.publicKeyHash);
  });

  it('adds Tezos account state under the Tezos address', () => {
    const state = walletReducers(undefined, addHdAccountAction(mockHdAccount));

    expect(state.accounts[0].id).toEqual(mockHdAccount.id);
    expect(state.accountsStateRecord[mockHdAccount.publicKeyHash]).toBeDefined();
  });
});
