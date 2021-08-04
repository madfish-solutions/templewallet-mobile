import { debounce } from 'lodash-es';
import React, { Fragment, useState } from 'react';

import { BottomSheet } from '../../../components/bottom-sheet/bottom-sheet';
import { BottomSheetActionButton } from '../../../components/bottom-sheet/bottom-sheet-action-button/bottom-sheet-action-button';
import { useBottomSheetController } from '../../../components/bottom-sheet/use-bottom-sheet-controller';
import { DataPlaceholder } from '../../../components/data-placeholder/data-placeholder';
import { Divider } from '../../../components/divider/divider';
import { ButtonWithIcon } from '../../../components/icon-button/icon-button';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { SearchInput } from '../../../components/search-input/search-input';
import { useFilteredAccountList } from '../../../hooks/use-filtered-account-list.hook';
import { emptyWalletAccount, WalletAccountInterface } from '../../../interfaces/wallet-account.interface';
import { ModalsEnum } from '../../../navigator/enums/modals.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { useImportedAccountListSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { InfoText } from '../info-text/info-text';
import { ManageAccountItem } from '../manage-hd-accounts/manage-account-item/manage-account-item';

export const ManageImportedAccounts = () => {
  const [managedAccount, setManagedAccount] = useState(emptyWalletAccount);
  const { navigate } = useNavigation();
  const accounts = useImportedAccountListSelector();
  const { setSearchValue, filteredAccountList } = useFilteredAccountList(accounts);
  const accountsLength = accounts.length;
  const revealSelectBottomSheetController = useBottomSheetController();

  const debouncedSetSearch = debounce(setSearchValue);

  const handleRevealPrivateKeyButtonPress = () => {
    navigate(ModalsEnum.RevealPrivateKey, { account: managedAccount });
    revealSelectBottomSheetController.close();
  };

  const handleRevealSeedPhraseButtonPress = () => {
    navigate(ModalsEnum.RevealSeedPhrase, { account: managedAccount });
    revealSelectBottomSheetController.close();
  };

  const handleRevealButtonPress = (account: WalletAccountInterface) => {
    setManagedAccount(account);
    setTimeout(() => revealSelectBottomSheetController.open());
  };

  return (
    <>
      <SearchInput onChangeText={debouncedSetSearch} placeholder="Search accounts" />
      <Divider size={formatSize(12)} />
      <InfoText />
      {filteredAccountList.map(account => (
        <Fragment key={account.publicKeyHash}>
          <ManageAccountItem account={account} onRevealButtonPress={handleRevealButtonPress} />
          <Divider size={formatSize(16)} />
        </Fragment>
      ))}
      <Divider size={formatSize(10)} />
      <ButtonWithIcon icon={IconNameEnum.DownloadCloud} text="import" onPress={() => navigate(ModalsEnum.ImportAccount)} />
      {accountsLength === 0 && <DataPlaceholder text="No found accounts" />}
      <BottomSheet
        title="Select what do you want to reveal:"
        contentHeight={formatSize(180)}
        controller={revealSelectBottomSheetController}>
        <BottomSheetActionButton title="Reveal Private key" onPress={handleRevealPrivateKeyButtonPress} />
        <BottomSheetActionButton title="Reveal Seed Phrase" onPress={handleRevealSeedPhraseButtonPress} />
      </BottomSheet>
    </>
  );
};
