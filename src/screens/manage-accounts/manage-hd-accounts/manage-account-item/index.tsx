import React, { FC } from 'react';
import { View } from 'react-native';

import { AccountCard } from 'src/components/account-card';
import { ButtonSmallSecondary } from 'src/components/button/button-small/button-small-secondary/button-small-secondary';
import { Switch } from 'src/components/switch/switch';
import { Account } from 'src/interfaces/account.interfaces';
import { dispatch } from 'src/store';
import { setAccountVisibility } from 'src/store/wallet/wallet-actions';
import { useIsAccountVisibleSelector } from 'src/store/wallet/wallet-selectors';
import { showWarningToast } from 'src/toast/toast.utils';

import { ManageAccountItemSelectors } from './selectors.ts';
import { useManageAccountItemStyles } from './styles.ts';

const VISIBILITY_WARNING = {
  title: 'Could not hide your selected account',
  description: 'Switch to another account and try again'
};

interface Props {
  account: Account;
  selectedAccount: Account;
  onManageButtonPress: SyncFn<Account>;
}

export const ManageAccountItem: FC<Props> = ({ account, selectedAccount, onManageButtonPress }) => {
  const styles = useManageAccountItemStyles();

  const isVisible = useIsAccountVisibleSelector(account.id) ?? true;

  const isVisibilitySwitchDisabled = account.id === selectedAccount.id;

  return (
    <AccountCard
      showAllAddresses
      account={account}
      detailsContainerStyle={styles.accountDetails}
      footer={
        <View style={styles.footer}>
          <ButtonSmallSecondary
            title="Manage"
            onPress={() => onManageButtonPress(account)}
            testID={ManageAccountItemSelectors.manageButton}
          />
          <View onTouchStart={() => void (isVisibilitySwitchDisabled && showWarningToast(VISIBILITY_WARNING))}>
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
