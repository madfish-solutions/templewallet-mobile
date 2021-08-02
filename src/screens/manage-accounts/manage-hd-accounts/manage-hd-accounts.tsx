import React, { Fragment, useState } from 'react';
import { Text, View } from 'react-native';

import { BottomSheet } from '../../../components/bottom-sheet/bottom-sheet';
import { BottomSheetActionButton } from '../../../components/bottom-sheet/bottom-sheet-action-button/bottom-sheet-action-button';
import { useBottomSheetController } from '../../../components/bottom-sheet/use-bottom-sheet-controller';
import { ButtonSmallSecondary } from '../../../components/button/button-small/button-small-secondary/button-small-secondary';
import { Divider } from '../../../components/divider/divider';
import { IconButton } from '../../../components/icon-button/icon-button';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { emptyWalletAccount, WalletAccountInterface } from '../../../interfaces/wallet-account.interface';
import { ModalsEnum } from '../../../navigator/enums/modals.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { useHdAccountsListSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { InfoText } from '../info-text/info-text';
import { ManageAccountItem } from './manage-account-item/manage-account-item';
import { useManageHdAccountsStyles } from './manage-hd-accounts.styles';

export const ManageHdAccounts = () => {
  const { navigate } = useNavigation();
  const styles = useManageHdAccountsStyles();
  const revealSelectBottomSheetController = useBottomSheetController();

  const hdAccounts = useHdAccountsListSelector();
  const [managedAccount, setManagedAccount] = useState(emptyWalletAccount);

  const handleRevealButtonPress = (account: WalletAccountInterface) => {
    setManagedAccount(account);
    // TODO: check if this needed for @gorhom/bottom-sheet v3+ (children rerender causes BottomSheet closing)
    setTimeout(() => revealSelectBottomSheetController.open());
  };

  const handleRevealPrivateKeyButtonPress = () => {
    navigate(ModalsEnum.RevealPrivateKey, { account: managedAccount });
    revealSelectBottomSheetController.close();
  };

  const handleRevealSeedPhraseButtonPress = () => {
    navigate(ModalsEnum.RevealSeedPhrase, { account: managedAccount });
    revealSelectBottomSheetController.close();
  };

  return (
    <>
      <View style={styles.revealSeedPhraseContainer}>
        <Text style={styles.revealSeedPhraseText}>Seed phrase is the same for all your HD accounts</Text>
        <Divider size={formatSize(16)} />
        <ButtonSmallSecondary
          title="Seed phrase"
          marginTop={formatSize(4)}
          marginBottom={formatSize(4)}
          onPress={() => navigate(ModalsEnum.RevealSeedPhrase, {})}
        />
      </View>

      <Divider size={formatSize(16)} />

      <InfoText />

      {hdAccounts.map(account => (
        <Fragment key={account.publicKeyHash}>
          <ManageAccountItem account={account} onRevealButtonPress={handleRevealButtonPress} />
          <Divider size={formatSize(16)} />
        </Fragment>
      ))}

      <Divider />

      <IconButton
        icon={IconNameEnum.PlusCircle}
        text="CREATE NEW"
        onPress={() => navigate(ModalsEnum.CreateHdAccount)}
      />

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
