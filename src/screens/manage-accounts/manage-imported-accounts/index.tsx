import React from 'react';

import { useImportedAccounts } from 'src/store/wallet/wallet-selectors';

import { ManageAccountsList } from '../manage-accounts-list';

import { ManageImportedAccountsSelectors } from './selectors.ts';

export const ManageImportedAccounts = () => {
  const importedAccounts = useImportedAccounts();

  return (
    <ManageAccountsList
      accounts={importedAccounts}
      searchInputTestID={ManageImportedAccountsSelectors.searchAccountsInput}
    />
  );
};
