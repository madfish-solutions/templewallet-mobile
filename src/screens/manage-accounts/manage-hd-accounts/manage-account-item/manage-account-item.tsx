import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { ButtonSmallSecondary } from '../../../../components/button/button-small/button-small-secondary/button-small-secondary';
import { Divider } from '../../../../components/divider/divider';
import { DollarEquivalentText } from '../../../../components/dollar-equivalent-text/dollar-equivalent-text';
import { PublicKeyHashText } from '../../../../components/public-key-hash-text/public-key-hash-text';
import { RobotIcon } from '../../../../components/robot-icon/robot-icon';
import { Switch } from '../../../../components/switch/switch';
import { EventFn } from '../../../../config/general';
import { WalletAccountInterface } from '../../../../interfaces/wallet-account.interface';
import { useTokensExchangeRatesSelector } from '../../../../store/currency/currency-selectors';
import { formatSize } from '../../../../styles/format-size';
import { TEZ_TOKEN_METADATA } from '../../../../token/data/tokens-metadata';
import { useManageAccountItemStyles } from './manage-account-item.styles';

interface Props {
  account: WalletAccountInterface;
  onRevealButtonPress: EventFn<WalletAccountInterface>;
}

export const ManageAccountItem: FC<Props> = ({ account, onRevealButtonPress }) => {
  const styles = useManageAccountItemStyles();
  const { tokensExchangeRates } = useTokensExchangeRatesSelector();

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
            {account.tezosBalance.data} {TEZ_TOKEN_METADATA.symbol}
          </Text>
          <DollarEquivalentText
            balance={account.tezosBalance.data}
            exchangeRate={tokensExchangeRates.data[TEZ_TOKEN_METADATA.name]}
            style={styles.equityText}
          />
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
