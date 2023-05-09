import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { AssetValueText } from '../../../../components/asset-value-text/asset-value-text';
import { ButtonSmallSecondary } from '../../../../components/button/button-small/button-small-secondary/button-small-secondary';
import { Divider } from '../../../../components/divider/divider';
import { HideBalance } from '../../../../components/hide-balance/hide-balance';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../../../components/icon/touchable-icon/touchable-icon';
import { RobotIcon } from '../../../../components/robot-icon/robot-icon';
import { Switch } from '../../../../components/switch/switch';
import { WalletAddress } from '../../../../components/wallet-address/wallet-address';
import { EventFn } from '../../../../config/general';
import { AccountInterface } from '../../../../interfaces/account.interface';
import { ModalsEnum } from '../../../../navigator/enums/modals.enum';
import { useNavigation } from '../../../../navigator/hooks/use-navigation.hook';
import { setAccountVisibility } from '../../../../store/wallet/wallet-actions';
import { useIsVisibleSelector, useTezosTokenSelector } from '../../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../../styles/format-size';
import { showWarningToast } from '../../../../toast/toast.utils';
import { getTruncatedProps } from '../../../../utils/style.util';
import { ManageAccountItemSelectors } from './manage-account-item.selectors';
import { useManageAccountItemStyles } from './manage-account-item.styles';

interface Props {
  account: AccountInterface;
  selectedAccount: AccountInterface;
  onRevealButtonPress: EventFn<AccountInterface>;
}

export const ManageAccountItem: FC<Props> = ({ account, selectedAccount, onRevealButtonPress }) => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const styles = useManageAccountItemStyles();
  const tezosToken = useTezosTokenSelector(account.publicKeyHash);
  const isVisible = useIsVisibleSelector(account.publicKeyHash);

  const isVisibilitySwitchDisabled = account.publicKeyHash === selectedAccount.publicKeyHash;

  return (
    <View style={styles.container}>
      <View style={styles.upperContainer}>
        <View style={styles.accountContainer}>
          <RobotIcon seed={account.publicKeyHash} />
          <View style={styles.accountContainerData}>
            <Text {...getTruncatedProps(styles.accountText)}>{account.name}</Text>
            <WalletAddress publicKeyHash={account.publicKeyHash} />
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Divider size={formatSize(16)} />
          <TouchableIcon
            name={IconNameEnum.Edit}
            size={formatSize(16)}
            onPress={() => navigate(ModalsEnum.RenameAccount, { account })}
            testID={ManageAccountItemSelectors.editButton}
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
            }
          >
            <Switch
              value={isVisible}
              disabled={isVisibilitySwitchDisabled}
              onChange={newIsVisible =>
                dispatch(
                  setAccountVisibility({
                    publicKeyHash: account.publicKeyHash,
                    isVisible: newIsVisible
                  })
                )
              }
              testID={ManageAccountItemSelectors.hideAccountToggle}
              testIDProperties={{ newValue: !isVisible }}
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
          testID={ManageAccountItemSelectors.revealButton}
        />
      </View>
    </View>
  );
};
