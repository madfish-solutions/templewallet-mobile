import { debounce } from 'lodash-es';
import React, { Fragment } from 'react';

import { DataPlaceholder } from '../../../components/data-placeholder/data-placeholder';
import { Divider } from '../../../components/divider/divider';
import { IconButton } from '../../../components/icon-button/icon-button';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { SearchInput } from '../../../components/search-input/search-input';
import { useFilteredAccountList } from '../../../hooks/use-filtered-account-list.hook';
import { ModalsEnum } from '../../../navigator/enums/modals.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { useImportedAccountListSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { InfoText } from '../info-text/info-text';
import { ManageAccountItem } from '../manage-hd-accounts/manage-account-item/manage-account-item';

export const ManageImportedAccounts = () => {
  const { navigate } = useNavigation();
  const accounts = useImportedAccountListSelector();
  const { setSearchValue, filteredAccountList } = useFilteredAccountList(accounts);
  const accountsLength = accounts.length;

  const debouncedSetSearch = debounce(setSearchValue);

  return (
    <>
      <SearchInput onChangeText={debouncedSetSearch} placeholder="Search accounts" />
      <Divider size={formatSize(12)} />
      <InfoText />
      {filteredAccountList.map(account => (
        <Fragment key={account.publicKeyHash}>
          <ManageAccountItem account={account} onRevealButtonPress={() => console.log('test')} />
          <Divider size={formatSize(16)} />
        </Fragment>
      ))}
      <Divider size={formatSize(10)} />
      <IconButton icon={IconNameEnum.DownloadCloud} text="import" onPress={() => navigate(ModalsEnum.ImportAccount)} />
      {accountsLength === 0 && <DataPlaceholder text="No found accounts" />}
    </>
  );
};
