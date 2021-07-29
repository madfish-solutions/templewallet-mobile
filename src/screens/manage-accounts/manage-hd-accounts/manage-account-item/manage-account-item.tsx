import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { BalanceText } from '../../../../components/balance-text/balance-text';
import { ButtonSmallSecondary } from '../../../../components/button/button-small/button-small-secondary/button-small-secondary';
import { Divider } from '../../../../components/divider/divider';
import { PublicKeyHashText } from '../../../../components/public-key-hash-text/public-key-hash-text';
import { RobotIcon } from '../../../../components/robot-icon/robot-icon';
import { Switch } from '../../../../components/switch/switch';
import { EventFn } from '../../../../config/general';
import { WalletAccountInterface } from '../../../../interfaces/wallet-account.interface';
import { useExchangeRatesSelector } from '../../../../store/currency/currency-selectors';
import { formatSize } from '../../../../styles/format-size';
import { TEZ_TOKEN_METADATA } from '../../../../token/data/tokens-metadata';
import { useManageAccountItemStyles } from './manage-account-item.styles';

interface Props {
  account: WalletAccountInterface;
  onRevealButtonPress: EventFn<WalletAccountInterface>;
}

export const ManageAccountItem: FC<Props> = ({ account, onRevealButtonPress }) => {
  const styles = useManageAccountItemStyles();
  const { exchangeRates } = useExchangeRatesSelector();

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
          <BalanceText style={styles.balanceText}>
            {account.tezosBalance.data} {TEZ_TOKEN_METADATA.symbol}
          </BalanceText>
          <BalanceText exchangeRate={exchangeRates.data[TEZ_TOKEN_METADATA.name]} style={styles.equityText}>
            {account.tezosBalance.data}
          </BalanceText>
        </View>

        <ButtonSmallSecondary
          title="Reveal"
          marginBottom={formatSize(8)}
          onPress={() => onRevealButtonPress(account)}
        />
      </View>
    </View>
  );
};
