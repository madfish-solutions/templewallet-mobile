import React from 'react';

import { useImportedAccounts } from 'src/store/wallet/wallet-selectors';

import { ManageAccountsList } from '../manage-accounts-list';

import { ManageImportedAccountsSelectors } from './manage-imported-accounts.selectors';

export const ManageImportedAccounts = () => {
  const importedAccounts = useImportedAccounts();

  return (
    <ManageAccountsList
      accounts={importedAccounts}
      searchInputTestID={ManageImportedAccountsSelectors.searchAccountsInput}
    />
  );
};
