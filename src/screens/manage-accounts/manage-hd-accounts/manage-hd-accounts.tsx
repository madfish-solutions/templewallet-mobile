import React, { Fragment, useState } from 'react';
import { Text, View } from 'react-native';

import { useBottomSheetController } from 'src/components/bottom-sheet/use-bottom-sheet-controller';
import { ButtonSmallSecondary } from 'src/components/button/button-small/button-small-secondary/button-small-secondary';
import { Divider } from 'src/components/divider/divider';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { SearchInput } from 'src/components/search-input/search-input';
import { useFilteredAccountList } from 'src/hooks/use-filtered-account-list.hook';
import { Account } from 'src/interfaces/account.interfaces';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';
import { useHDAccounts, useAccount } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';

import { ManageAccountActionsBottomSheet } from '../manage-account-actions-bottom-sheet';
import { useManageAccountsStyles } from '../manage-accounts.styles';
import { useIsAccountsListScrolled } from '../use-is-accounts-list-scrolled.hook';

import { ManageAccountItem } from './manage-account-item/manage-account-item';
import { ManageHdAccountsSelectors } from './manage-hd-accounts.selectors';
import { useManageHdAccountsStyles } from './manage-hd-accounts.styles';

export const ManageHdAccounts = () => {
  const navigateToModal = useNavigateToModal();
  const styles = useManageHdAccountsStyles();
  const manageAccountsStyles = useManageAccountsStyles();
  const manageBottomSheetController = useBottomSheetController();
  const { isScrolled, handleScroll, scrollViewRef } = useIsAccountsListScrolled();

  const selectedAccount = useAccount();
  const hdAccounts = useHDAccounts();
  const { debouncedSetSearch, filteredAccountList } = useFilteredAccountList(hdAccounts);

  const [managedAccount, setManagedAccount] = useState<Account | null>(null);

  const handleManageButtonPress = (account: Account) => {
    setManagedAccount(account);
    manageBottomSheetController.open();
  };

  return (
    <>
      <View
        style={[manageAccountsStyles.fixedContent, isScrolled ? manageAccountsStyles.fixedContentShadow : undefined]}
      >
        <SearchInput
          placeholder="Search accounts"
          onChangeText={debouncedSetSearch}
          testID={ManageHdAccountsSelectors.searchAccountsInput}
        />
        <Divider size={formatSize(12)} />
        <View style={styles.revealSeedPhraseContainer}>
          <Text style={styles.revealSeedPhraseText}>Seed phrase is the same for all your HD accounts</Text>
          <Divider size={formatSize(8)} />
          <ButtonSmallSecondary
            title="Seed phrase"
            onPress={() => navigateToModal(ModalsEnum.RevealSeedPhrase)}
            testID={ManageHdAccountsSelectors.seedPhraseButton}
          />
        </View>
      </View>

      <ScreenContainer
        contentContainerStyle={styles.scrollableContentContainer}
        scrollViewRef={scrollViewRef}
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

        <Divider />

        <ManageAccountActionsBottomSheet account={managedAccount} controller={manageBottomSheetController} />
      </ScreenContainer>
    </>
  );
};
