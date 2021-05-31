import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { Fragment } from 'react';
import { Text, View } from 'react-native';

import { ButtonSmallSecondary } from '../../../components/button/button-small/button-small-secondary/button-small-secondary';
import { Divider } from '../../../components/divider/divider';
import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { ModalsEnum } from '../../../navigator/modals.enum';
import { useNavigation } from '../../../navigator/use-navigation.hook';
import { useHdAccountsListSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { InfoText } from '../info-text/info-text';
import { ManageAccountItem } from '../manage-account-item/manage-account-item';
import { useManageHdAccountsStyles } from './manage-hd-accounts.styles';

export const ManageHdAccounts = () => {
  const styles = useManageHdAccountsStyles();
  const { navigate } = useNavigation();

  const hdAccounts = useHdAccountsListSelector();

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
          <ManageAccountItem account={account} />
          <Divider size={formatSize(16)} />
        </Fragment>
      ))}

      <Divider />

      <TouchableOpacity style={styles.addAccountButton} onPress={() => navigate(ModalsEnum.CreateHdAccount)}>
        <Icon name={IconNameEnum.PlusCircle} />
        <Text style={styles.addAccountText}>CREATE NEW</Text>
      </TouchableOpacity>
    </>
  );
};
