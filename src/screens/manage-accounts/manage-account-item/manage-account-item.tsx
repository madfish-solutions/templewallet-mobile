import React, { FC } from 'react';
import { Switch, Text, View } from 'react-native';

import { ButtonSmallSecondary } from '../../../components/button/button-small/button-small-secondary/button-small-secondary';
import { Divider } from '../../../components/divider/divider';
import { PublicKeyHashText } from '../../../components/public-key-hash-text/public-key-hash-text';
import { RobotIcon } from '../../../components/robot-icon/robot-icon';
import { WalletAccountInterface } from '../../../interfaces/wallet-account.interface';
import { useShelter } from '../../../shelter/use-shelter.hook';
import { formatSize } from '../../../styles/format-size';
import { XTZ_TOKEN_METADATA } from '../../../token/data/tokens-metadata';
import { useManageAccountItemStyles } from './manage-account-item.styles';

interface Props {
  account: WalletAccountInterface;
}

export const ManageAccountItem: FC<Props> = ({ account }) => {
  const styles = useManageAccountItemStyles();
  const { revealSecretKey } = useShelter();

  return (
    <View style={styles.container}>
      <View style={styles.upperContainer}>
        <View style={styles.accountContainer}>
          <RobotIcon seed={account.publicKeyHash} />
          <View style={styles.accountContainerData}>
            <Text style={styles.accountText}>{account.name}</Text>
            <PublicKeyHashText publicKeyHash={account.publicKeyHash} />
          </View>
        </View>

        <Switch value={true} disabled={true} />
      </View>

      <Divider size={formatSize(16)} />

      <View style={styles.lowerContainer}>
        <View style={styles.lowerContainerData}>
          <Text style={styles.balanceText}>
            {account.tezosBalance.data} {XTZ_TOKEN_METADATA.symbol}
          </Text>
          <Text style={styles.equityText}>X XXX.XX $</Text>
        </View>

        <ButtonSmallSecondary
          title="Reveal"
          marginBottom={formatSize(8)}
          onPress={() => revealSecretKey(account.publicKeyHash)}
        />
      </View>
    </View>
  );
};
