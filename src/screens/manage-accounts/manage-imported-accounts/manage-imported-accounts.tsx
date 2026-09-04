import React, { Fragment, useState } from 'react';
import { StyleSheet } from 'react-native';

import { useBottomSheetController } from 'src/components/bottom-sheet/use-bottom-sheet-controller';
import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { Divider } from 'src/components/divider/divider';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { SearchInput } from 'src/components/search-input/search-input';
import { useFilteredAccountList } from 'src/hooks/use-filtered-account-list.hook';
import { Account } from 'src/interfaces/account.interfaces';
import { useImportedAccounts, useAccount } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';

import { ManageAccountActionsBottomSheet } from '../manage-account-actions-bottom-sheet';
import { ManageAccountItem } from '../manage-hd-accounts/manage-account-item/manage-account-item';

import { ManageImportedAccountsSelectors } from './manage-imported-accounts.selectors';

export const ManageImportedAccounts = () => {
  const selectedAccount = useAccount();
  const importedAccounts = useImportedAccounts();
  const { debouncedSetSearch, filteredAccountList } = useFilteredAccountList(importedAccounts);

  const accountsLength = importedAccounts.length;
  const manageBottomSheetController = useBottomSheetController();
  const [managedAccount, setManagedAccount] = useState<Account | null>(null);

  const handleManageButtonPress = (account: Account) => {
    setManagedAccount(account);
    manageBottomSheetController.open();
  };

  return (
    <>
      <SearchInput
        placeholder="Search accounts"
        onChangeText={debouncedSetSearch}
        testID={ManageImportedAccountsSelectors.searchAccountsInput}
      />
      <Divider size={formatSize(12)} />
      <ScreenContainer contentContainerStyle={styles.container}>
        {filteredAccountList.map(account => (
          <Fragment key={account.id}>
            <ManageAccountItem
              account={account}
              selectedAccount={selectedAccount}
              onManageButtonPress={handleManageButtonPress}
            />
            <Divider size={formatSize(16)} />
          </Fragment>
        ))}
        <Divider size={formatSize(10)} />
        {accountsLength === 0 && <DataPlaceholder text="No found accounts" />}
        <ManageAccountActionsBottomSheet account={managedAccount} controller={manageBottomSheetController} />
      </ScreenContainer>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: formatSize(16)
  }
});
