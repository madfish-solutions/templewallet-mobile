import { initialAccountState } from 'src/interfaces/account-state.interface';
import { mockHdAccount, mockNewHdAccount } from 'src/interfaces/account.interface.mock';

import { addAccountsAction } from './wallet-actions';
import { walletReducers } from './wallet-reducers';

it('should add imported accounts in one reducer action', () => {
  const accounts = [mockHdAccount, mockNewHdAccount];
  const state = walletReducers(undefined, addAccountsAction(accounts));

  expect(state.accounts).toEqual(accounts);
  expect(state.accountsStateRecord).toEqual({
    [mockHdAccount.id]: initialAccountState,
    [mockNewHdAccount.id]: initialAccountState
  });
});
