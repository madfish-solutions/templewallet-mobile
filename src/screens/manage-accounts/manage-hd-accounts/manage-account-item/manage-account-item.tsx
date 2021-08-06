import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { ButtonSmallSecondary } from '../../../../components/button/button-small/button-small-secondary/button-small-secondary';
import { Divider } from '../../../../components/divider/divider';
import { DollarValueText } from '../../../../components/dollar-value-text/dollar-value-text';
import { HideBalance } from '../../../../components/hide-balance/hide-balance';
import { PublicKeyHashText } from '../../../../components/public-key-hash-text/public-key-hash-text';
import { RobotIcon } from '../../../../components/robot-icon/robot-icon';
import { Switch } from '../../../../components/switch/switch';
import { TokenValueText } from '../../../../components/token-value-text/token-value-text';
import { EventFn } from '../../../../config/general';
import { useTezExchangeRate } from '../../../../hooks/use-tez-exchange-rate.hook';
import { WalletAccountInterface } from '../../../../interfaces/wallet-account.interface';
import { formatSize } from '../../../../styles/format-size';
import { TEZ_TOKEN_METADATA } from '../../../../token/data/tokens-metadata';
import { useManageAccountItemStyles } from './manage-account-item.styles';

interface Props {
  account: WalletAccountInterface;
  onRevealButtonPress: EventFn<WalletAccountInterface>;
}

export const ManageAccountItem: FC<Props> = ({ account, onRevealButtonPress }) => {
  const styles = useManageAccountItemStyles();
  const tezExchangeRate = useTezExchangeRate();

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
          <HideBalance style={styles.balanceText}>
            <TokenValueText balance={account.tezosBalance.data} tokenSymbol={TEZ_TOKEN_METADATA.symbol} />
          </HideBalance>
          <HideBalance style={styles.equityText}>
            <DollarValueText balance={account.tezosBalance.data} exchangeRate={tezExchangeRate} />
          </HideBalance>
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
