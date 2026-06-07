import React, { memo, useCallback } from 'react';
import { View } from 'react-native';

import { Account } from 'src/interfaces/account.interfaces.ts';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { dispatch } from 'src/store';
import { setSelectedAccountIdAction } from 'src/store/wallet/wallet-actions';
import { useAccount, useAllVisibleAccounts } from 'src/store/wallet/wallet-selectors';

import { DropdownValueProps } from '../dropdown/dropdown';
import { IconNameEnum } from '../icon/icon-name.enum';

import { AccountDropdownBase, AccountDropdownValueComponent } from './account-dropdown-base';
import { AccountDropdownTriggerItem, renderAccountListItem } from './account-dropdown-item/account-dropdown-item';
import { CurrentAccountDropdownStyles } from './current-account-dropdown.styles';

const renderAccountValue: AccountDropdownValueComponent = ({ value, isCollectibleScreen }) => (
  <AccountDropdownTriggerItem
    account={value}
    showFullData={false}
    actionIconName={IconNameEnum.Copy}
    isCollectibleScreen={isCollectibleScreen}
  />
);

type Props = Omit<DropdownValueProps<Account>, 'list' | 'value' | 'onValueChange'> & TestIdProps;

export const CurrentAccountDropdown = memo<Props>(({ testID, testIDProperties, isCollectibleScreen }) => {
  const selectedAccount = useAccount();
  const visibleAccounts = useAllVisibleAccounts();

  const onValueChange = useCallback((value: Account) => dispatch(setSelectedAccountIdAction(value.id)), []);

  return (
    <View style={CurrentAccountDropdownStyles.root}>
      <AccountDropdownBase
        value={selectedAccount}
        list={visibleAccounts}
        renderValue={renderAccountValue}
        renderAccountListItem={renderAccountListItem}
        onValueChange={onValueChange}
        testID={testID}
        testIDProperties={testIDProperties}
        isCollectibleScreen={isCollectibleScreen}
      />
    </View>
  );
});
