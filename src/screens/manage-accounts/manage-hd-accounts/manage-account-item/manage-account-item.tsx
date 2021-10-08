import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { AssetValueText } from '../../../../components/asset-value-text/asset-value-text';
import { ButtonSmallSecondary } from '../../../../components/button/button-small/button-small-secondary/button-small-secondary';
import { Divider } from '../../../../components/divider/divider';
import { HideBalance } from '../../../../components/hide-balance/hide-balance';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../../../components/icon/touchable-icon/touchable-icon';
import { PublicKeyHashText } from '../../../../components/public-key-hash-text/public-key-hash-text';
import { RobotIcon } from '../../../../components/robot-icon/robot-icon';
import { Switch } from '../../../../components/switch/switch';
import { EventFn } from '../../../../config/general';
import { WalletAccountInterface } from '../../../../interfaces/wallet-account.interface';
import { ModalsEnum } from '../../../../navigator/enums/modals.enum';
import { useNavigation } from '../../../../navigator/hooks/use-navigation.hook';
import { updateWalletAccountAction } from '../../../../store/wallet/wallet-actions';
import { formatSize } from '../../../../styles/format-size';
import { showWarningToast } from '../../../../toast/toast.utils';
import { getTruncatedProps } from '../../../../utils/style.util';
import { getTezosToken } from '../../../../utils/wallet.utils';
import { useManageAccountItemStyles } from './manage-account-item.styles';

interface Props {
  account: WalletAccountInterface;
  selectedAccount: WalletAccountInterface;
  onRevealButtonPress: EventFn<WalletAccountInterface>;
}

export const ManageAccountItem: FC<Props> = ({ account, selectedAccount, onRevealButtonPress }) => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const styles = useManageAccountItemStyles();

  const tezosToken = getTezosToken(account.tezosBalance.data);
  const isVisibilitySwitchDisabled = account.publicKeyHash === selectedAccount.publicKeyHash;

  return (
    <View style={styles.container}>
      <View style={styles.upperContainer}>
        <View style={styles.accountContainer}>
          <RobotIcon seed={account.publicKeyHash} />
          <View style={styles.accountContainerData}>
            <Text {...getTruncatedProps(styles.accountText)}>{account.name}</Text>
            <PublicKeyHashText publicKeyHash={account.publicKeyHash} />
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Divider size={formatSize(16)} />
          <TouchableIcon
            name={IconNameEnum.Edit}
            size={formatSize(16)}
            onPress={() => navigate(ModalsEnum.RenameAccount, { account })}
          />
          <Divider size={formatSize(16)} />

          <View
            onTouchStart={() =>
              void (
                isVisibilitySwitchDisabled &&
                showWarningToast({
                  title: 'Could not hide your selected account',
                  description: 'Switch to another account and try again'
                })
              )
            }>
            <Switch
              value={account.isVisible}
              disabled={isVisibilitySwitchDisabled}
              onChange={isVisible => dispatch(updateWalletAccountAction({ ...account, isVisible }))}
            />
          </View>
        </View>
      </View>

      <Divider size={formatSize(16)} />

      <View style={styles.lowerContainer}>
        <View style={styles.lowerContainerData}>
          <HideBalance style={styles.balanceText}>
            <AssetValueText asset={tezosToken} amount={tezosToken.balance} />
          </HideBalance>
          <HideBalance style={styles.equityText}>
            <AssetValueText convertToDollar asset={tezosToken} amount={tezosToken.balance} />
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
