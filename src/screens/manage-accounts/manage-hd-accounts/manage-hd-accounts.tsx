import React, { Fragment, useState } from 'react';
import { Text, View } from 'react-native';

import { BottomSheet } from 'src/components/bottom-sheet/bottom-sheet';
import { BottomSheetActionButton } from 'src/components/bottom-sheet/bottom-sheet-action-button/bottom-sheet-action-button';
import { useBottomSheetController } from 'src/components/bottom-sheet/use-bottom-sheet-controller';
import { ButtonSmallSecondary } from 'src/components/button/button-small/button-small-secondary/button-small-secondary';
import { Divider } from 'src/components/divider/divider';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { SearchInput } from 'src/components/search-input/search-input';
import { useFilteredAccountList } from 'src/hooks/use-filtered-account-list.hook';
import { AccountInterface, emptyAccount } from 'src/interfaces/account.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';
import { useHdAccountListSelector, useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';

import { InfoText } from '../info-text/info-text';

import { ManageAccountItem } from './manage-account-item/manage-account-item';
import { ManageHdAccountsSelectors } from './manage-hd-accounts.selectors';
import { useManageHdAccountsStyles } from './manage-hd-accounts.styles';

export const ManageHdAccounts = () => {
  const navigateToModal = useNavigateToModal();
  const styles = useManageHdAccountsStyles();
  const revealSelectBottomSheetController = useBottomSheetController();

  const selectedAccount = useSelectedAccountSelector();
  const hdAccounts = useHdAccountListSelector();
  const { debouncedSetSearch, filteredAccountList } = useFilteredAccountList(hdAccounts);

  const [managedAccount, setManagedAccount] = useState(emptyAccount);

  const handleRevealButtonPress = (account: AccountInterface) => {
    setManagedAccount(account);
    revealSelectBottomSheetController.open();
  };

  const handleRevealPrivateKeyButtonPress = () => {
    navigateToModal(ModalsEnum.RevealPrivateKey, { account: managedAccount });
    revealSelectBottomSheetController.close();
  };

  const handleRevealSeedPhraseButtonPress = () => {
    navigateToModal(ModalsEnum.RevealSeedPhrase, { account: managedAccount });
    revealSelectBottomSheetController.close();
  };

  return (
    <>
      <SearchInput
        placeholder="Search accounts"
        onChangeText={debouncedSetSearch}
        testID={ManageHdAccountsSelectors.searchAccountsInput}
      />
      <Divider size={formatSize(8)} />
      <View style={styles.revealSeedPhraseContainer}>
        <Text style={styles.revealSeedPhraseText}>Seed phrase is the same for all your HD accounts</Text>
        <Divider size={formatSize(16)} />
        <ButtonSmallSecondary
          title="Seed phrase"
          marginTop={formatSize(4)}
          marginBottom={formatSize(4)}
          onPress={() => navigateToModal(ModalsEnum.RevealSeedPhrase, {})}
          testID={ManageHdAccountsSelectors.seedPhraseButton}
        />
      </View>

      <Divider size={formatSize(16)} />

      <InfoText />
      <ScreenContainer>
        {filteredAccountList.map(account => (
          <Fragment key={account.publicKeyHash}>
            <ManageAccountItem
              account={account}
              selectedAccount={selectedAccount}
              onRevealButtonPress={handleRevealButtonPress}
            />
            <Divider size={formatSize(16)} />
          </Fragment>
        ))}

        <Divider />

        <BottomSheet
          description="Select what do you want to reveal:"
          contentHeight={formatSize(180)}
          controller={revealSelectBottomSheetController}
        >
          <BottomSheetActionButton
            title="Reveal Private key"
            onPress={handleRevealPrivateKeyButtonPress}
            testID={ManageHdAccountsSelectors.revealPrivateKeyButton}
          />
          <BottomSheetActionButton
            title="Reveal Seed Phrase"
            onPress={handleRevealSeedPhraseButtonPress}
            testID={ManageHdAccountsSelectors.revealSeedPhraseButton}
          />
        </BottomSheet>
      </ScreenContainer>
    </>
  );
};
