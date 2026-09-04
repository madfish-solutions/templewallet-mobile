import React, { FC, Fragment, ReactNode, useState } from 'react';
import { View } from 'react-native';

import { useBottomSheetController } from 'src/components/bottom-sheet/use-bottom-sheet-controller';
import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { Divider } from 'src/components/divider/divider';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { SearchInput } from 'src/components/search-input/search-input';
import { useFilteredAccountList } from 'src/hooks/use-filtered-account-list.hook';
import { Account } from 'src/interfaces/account.interfaces';
import { useAccount } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';

import { ManageAccountActionsBottomSheet } from './manage-account-actions-bottom-sheet';
import { useManageAccountsStyles } from './manage-accounts.styles';
import { ManageAccountItem } from './manage-hd-accounts/manage-account-item/manage-account-item';
import { useIsAccountsListScrolled } from './use-is-accounts-list-scrolled.hook';

interface Props {
  accounts: Account[];
  searchInputTestID: string;
  fixedContent?: ReactNode;
}

export const ManageAccountsList: FC<Props> = ({ accounts, searchInputTestID, fixedContent }) => {
  const styles = useManageAccountsStyles();
  const manageBottomSheetController = useBottomSheetController();
  const { isScrolled, handleScroll } = useIsAccountsListScrolled();
  const { filteredAccountList, setSearchValue } = useFilteredAccountList(accounts);
  const selectedAccount = useAccount();
  const [managedAccount, setManagedAccount] = useState<Account | null>(null);

  const handleManageButtonPress = (account: Account) => {
    setManagedAccount(account);
    manageBottomSheetController.open();
  };

  return (
    <>
      <View style={[styles.fixedContent, isScrolled ? styles.fixedContentShadow : undefined]}>
        <SearchInput placeholder="Search accounts" onChangeText={setSearchValue} testID={searchInputTestID} />
        <Divider size={formatSize(12)} />
        {fixedContent}
      </View>

      <ScreenContainer
        contentContainerStyle={styles.scrollableContentContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
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

        {filteredAccountList.length === 0 && <DataPlaceholder text="No records found." />}
        <Divider />
      </ScreenContainer>

      <ManageAccountActionsBottomSheet account={managedAccount} controller={manageBottomSheetController} />
    </>
  );
};
