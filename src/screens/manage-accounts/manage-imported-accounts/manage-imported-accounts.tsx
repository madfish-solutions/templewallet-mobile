import React, { Fragment } from 'react';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { Divider } from 'src/components/divider/divider';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { SearchInput } from 'src/components/search-input/search-input';
import { useFilteredAccountList } from 'src/hooks/use-filtered-account-list.hook';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';
import { useImportedAccountListSelector, useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';

import { InfoText } from '../info-text/info-text';
import { ManageAccountItem } from '../manage-hd-accounts/manage-account-item/manage-account-item';

import { ManageImportedAccountsSelectors } from './manage-imported-accounts.selectors';

export const ManageImportedAccounts = () => {
  const navigateToModal = useNavigateToModal();

  const selectedAccount = useSelectedAccountSelector();
  const importedAccounts = useImportedAccountListSelector();
  const { debouncedSetSearch, filteredAccountList } = useFilteredAccountList(importedAccounts);

  const accountsLength = importedAccounts.length;

  return (
    <>
      <SearchInput
        placeholder="Search accounts"
        onChangeText={debouncedSetSearch}
        testID={ManageImportedAccountsSelectors.searchAccountsInput}
      />
      <Divider size={formatSize(8)} />
      <InfoText />
      <ScreenContainer>
        {filteredAccountList.map(account => (
          <Fragment key={account.publicKeyHash}>
            <ManageAccountItem
              account={account}
              selectedAccount={selectedAccount}
              onRevealButtonPress={() => navigateToModal(ModalsEnum.RevealPrivateKey, { account })}
            />
            <Divider size={formatSize(16)} />
          </Fragment>
        ))}
        <Divider size={formatSize(10)} />
        {accountsLength === 0 && <DataPlaceholder text="No found accounts" />}
      </ScreenContainer>
    </>
  );
};
