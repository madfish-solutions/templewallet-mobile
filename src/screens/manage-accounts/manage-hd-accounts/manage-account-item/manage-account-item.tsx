import React, { FC } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { AssetValueText } from 'src/components/asset-value-text/asset-value-text';
import { ButtonSmallSecondary } from 'src/components/button/button-small/button-small-secondary/button-small-secondary';
import { Divider } from 'src/components/divider/divider';
import { HideBalance } from 'src/components/hide-balance/hide-balance';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableIcon } from 'src/components/icon/touchable-icon/touchable-icon';
import { RobotIcon } from 'src/components/robot-icon/robot-icon';
import { Switch } from 'src/components/switch/switch';
import { TruncatedText } from 'src/components/truncated-text';
import { WalletAddress } from 'src/components/wallet-address/wallet-address';
import { AccountInterface } from 'src/interfaces/account.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';
import { setAccountVisibility } from 'src/store/wallet/wallet-actions';
import { useIsAccountVisibleSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showWarningToast } from 'src/toast/toast.utils';
import { useTezosTokenOfKnownAccount } from 'src/utils/wallet.utils';

import { ManageAccountItemSelectors } from './manage-account-item.selectors';
import { useManageAccountItemStyles } from './manage-account-item.styles';

interface Props {
  account: AccountInterface;
  selectedAccount: AccountInterface;
  onRevealButtonPress: SyncFn<AccountInterface>;
}

export const ManageAccountItem: FC<Props> = ({ account, selectedAccount, onRevealButtonPress }) => {
  const dispatch = useDispatch();
  const navigateToModal = useNavigateToModal();
  const styles = useManageAccountItemStyles();
  const tezosToken = useTezosTokenOfKnownAccount(account.publicKeyHash);
  const isVisible = useIsAccountVisibleSelector(account.publicKeyHash) ?? true;

  const isVisibilitySwitchDisabled = account.publicKeyHash === selectedAccount.publicKeyHash;

  return (
    <View style={styles.container}>
      <View style={styles.upperContainer}>
        <View style={styles.accountContainer}>
          <RobotIcon seed={account.publicKeyHash} />
          <View style={styles.accountContainerData}>
            <TruncatedText style={styles.accountText}>{account.name}</TruncatedText>
            <WalletAddress publicKeyHash={account.publicKeyHash} />
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Divider size={formatSize(16)} />
          <TouchableIcon
            name={IconNameEnum.Edit}
            size={formatSize(16)}
            onPress={() => navigateToModal(ModalsEnum.RenameAccount, { account })}
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
