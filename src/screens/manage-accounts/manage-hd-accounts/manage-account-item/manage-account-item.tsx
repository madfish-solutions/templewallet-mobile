import React, { FC } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { AccountCard } from 'src/components/account-card';
import { ButtonSmallSecondary } from 'src/components/button/button-small/button-small-secondary/button-small-secondary';
import { Switch } from 'src/components/switch/switch';
import { Account } from 'src/interfaces/account.interfaces';
import { setAccountVisibility } from 'src/store/wallet/wallet-actions';
import { useIsAccountVisibleSelector } from 'src/store/wallet/wallet-selectors';
import { showWarningToast } from 'src/toast/toast.utils';
import { getAccountAddressForTezos } from 'src/utils/account.utils';

import { ManageAccountItemSelectors } from './manage-account-item.selectors';
import { useManageAccountItemStyles } from './manage-account-item.styles';

interface Props {
  account: Account;
  selectedAccount: Account;
  onManageButtonPress: SyncFn<Account>;
}

export const ManageAccountItem: FC<Props> = ({ account, selectedAccount, onManageButtonPress }) => {
  const dispatch = useDispatch();
  const styles = useManageAccountItemStyles();

  const tezosAddress = getAccountAddressForTezos(account);
  const isVisible = useIsAccountVisibleSelector(account.id) ?? true;

  const isVisibilitySwitchDisabled = !tezosAddress || account.id === selectedAccount.id;
  const visibilityWarning = tezosAddress
    ? {
        title: 'Could not hide your selected account',
        description: 'Switch to another account and try again'
      }
    : {
        title: 'Could not hide this account',
        description: 'EVM-only accounts stay visible until EVM account management is supported'
      };

  return (
    <AccountCard
      account={account}
      showAllAddresses
      detailsContainerStyle={styles.accountDetails}
      footer={
        <View style={styles.footer}>
          <ButtonSmallSecondary
            title="Manage"
            onPress={() => onManageButtonPress(account)}
            testID={ManageAccountItemSelectors.manageButton}
          />
          <View onTouchStart={() => void (isVisibilitySwitchDisabled && showWarningToast(visibilityWarning))}>
            <Switch
              value={isVisible}
              disabled={isVisibilitySwitchDisabled}
              onChange={newIsVisible =>
                dispatch(
                  setAccountVisibility({
                    accountId: account.id,
                    isVisible: newIsVisible
                  })
                )
              }
              testID={ManageAccountItemSelectors.hideAccountToggle}
              testIDProperties={{ newValue: !isVisible }}
            />
          </View>
        </View>
      }
    />
  );
};
