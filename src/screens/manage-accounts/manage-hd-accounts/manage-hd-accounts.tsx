import React from 'react';
import { Text, View } from 'react-native';

import { ButtonSmallSecondary } from 'src/components/button/button-small/button-small-secondary/button-small-secondary';
import { Divider } from 'src/components/divider/divider';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';
import { useHDAccounts } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';

import { ManageAccountsList } from '../manage-accounts-list';

import { ManageHdAccountsSelectors } from './manage-hd-accounts.selectors';
import { useManageHdAccountsStyles } from './manage-hd-accounts.styles';

export const ManageHdAccounts = () => {
  const navigateToModal = useNavigateToModal();
  const styles = useManageHdAccountsStyles();
  const hdAccounts = useHDAccounts();

  return (
    <ManageAccountsList
      accounts={hdAccounts}
      searchInputTestID={ManageHdAccountsSelectors.searchAccountsInput}
      fixedContent={
        <View style={styles.revealSeedPhraseContainer}>
          <Text style={styles.revealSeedPhraseText}>Seed phrase is the same for all your HD accounts</Text>
          <Divider size={formatSize(8)} />
          <ButtonSmallSecondary
            title="Seed phrase"
            onPress={() => navigateToModal(ModalsEnum.RevealSeedPhrase)}
            testID={ManageHdAccountsSelectors.seedPhraseButton}
          />
        </View>
      }
    />
  );
};
