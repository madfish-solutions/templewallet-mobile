import React, { memo, useCallback } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { AddressBookItem } from 'src/interfaces/account.interfaces';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { setSelectedAccountIdAction } from 'src/store/wallet/wallet-actions';
import { useAccount, useAllVisibleAccounts } from 'src/store/wallet/wallet-selectors';
import { getAccountBaseId } from 'src/utils/account.utils';

import { DropdownValueComponent, DropdownValueProps } from '../dropdown/dropdown';
import { IconNameEnum } from '../icon/icon-name.enum';

import { AccountDropdownBase } from './account-dropdown-base';
import { AccountDropdownTriggerItem, renderAccountListItem } from './account-dropdown-item/account-dropdown-item';
import { CurrentAccountDropdownStyles } from './current-account-dropdown.styles';

const renderAccountValue: DropdownValueComponent<AddressBookItem> = ({ value, isCollectibleScreen }) => (
  <AccountDropdownTriggerItem
    account={value}
    showFullData={false}
    actionIconName={IconNameEnum.Copy}
    isCollectibleScreen={isCollectibleScreen}
  />
);

type Props = Omit<DropdownValueProps<AddressBookItem>, 'list' | 'value' | 'onValueChange'> & TestIdProps;

export const CurrentAccountDropdown = memo<Props>(({ testID, testIDProperties, isCollectibleScreen }) => {
  const selectedAccount = useAccount();
  const visibleAccounts = useAllVisibleAccounts();

  const dispatch = useDispatch();

  const onValueChange = useCallback(
    (value: AddressBookItem | undefined) =>
      dispatch(setSelectedAccountIdAction(value ? getAccountBaseId(value) : undefined)),
    [dispatch]
  );

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
