import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonSmallSecondary } from '../../../../components/button/button-small/button-small-secondary/button-small-secondary';
import { Divider } from '../../../../components/divider/divider';
import { DollarValueText } from '../../../../components/dollar-value-text/dollar-value-text';
import { HideBalance } from '../../../../components/hide-balance/hide-balance';
import { PublicKeyHashText } from '../../../../components/public-key-hash-text/public-key-hash-text';
import { RobotIcon } from '../../../../components/robot-icon/robot-icon';
import { Switch } from '../../../../components/switch/switch';
import { TokenValueText } from '../../../../components/token-value-text/token-value-text';
import { EventFn } from '../../../../config/general';
import { WalletAccountInterface } from '../../../../interfaces/wallet-account.interface';
import { updateWalletAccountAction } from '../../../../store/wallet/wallet-actions';
import { formatSize } from '../../../../styles/format-size';
import { getTezosToken } from '../../../../utils/wallet.utils';
import { useManageAccountItemStyles } from './manage-account-item.styles';
import { showWarningToast } from '../../../../toast/toast.utils';

interface Props {
  account: WalletAccountInterface;
  selectedAccount: WalletAccountInterface;
  onRevealButtonPress: EventFn<WalletAccountInterface>;
}

export const ManageAccountItem: FC<Props> = ({ account, selectedAccount, onRevealButtonPress }) => {
  const dispatch = useDispatch();
  const styles = useManageAccountItemStyles();

  const tezosToken = getTezosToken(account.tezosBalance.data);

  const handleVisibleSwitchChange = (isVisible: boolean) => {
    if (account.publicKeyHash === selectedAccount.publicKeyHash) {
      showWarningToast({
        title: 'Could not hide your selected account',
        description: 'Switch to another account and try again'
      });
    } else {
      dispatch(updateWalletAccountAction({ ...account, isVisible }));
    }
  };

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

        <Switch value={account.isVisible} onChange={handleVisibleSwitchChange} />
      </View>

      <Divider size={formatSize(16)} />

      <View style={styles.lowerContainer}>
        <View style={styles.lowerContainerData}>
          <HideBalance style={styles.balanceText}>
            <TokenValueText token={tezosToken} amount={tezosToken.balance} />
          </HideBalance>
          <HideBalance style={styles.equityText}>
            <DollarValueText token={tezosToken} amount={tezosToken.balance} />
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
