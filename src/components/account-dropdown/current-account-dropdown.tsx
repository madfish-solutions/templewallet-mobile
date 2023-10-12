import React, { memo, useCallback } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { isAndroid } from 'src/config/system';
import { AccountBaseInterface } from 'src/interfaces/account.interface';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { setSelectedAccountAction } from 'src/store/wallet/wallet-actions';
import { useSelectedAccountSelector, useVisibleAccountsListSelector } from 'src/store/wallet/wallet-selectors';

import { DropdownValueComponent, DropdownValueProps } from '../dropdown/dropdown';
import { IconNameEnum } from '../icon/icon-name.enum';
import { AccountDropdownBase } from './account-dropdown-base';
import { AccountDropdownItem, renderAccountListItem } from './account-dropdown-item/account-dropdown-item';
import { CurrentAccountDropdownStyles } from './current-account-dropdown.styles';

const renderAccountValue: DropdownValueComponent<AccountBaseInterface> = ({ value, isCollectibleScreen }) => (
  <AccountDropdownItem
    account={value}
    showFullData={false}
    actionIconName={IconNameEnum.TriangleDown}
    isPublicKeyHashTextDisabled={isAndroid}
    isCollectibleScreen={isCollectibleScreen}
  />
);

type Props = Omit<DropdownValueProps<AccountBaseInterface>, 'list' | 'value' | 'onValueChange'> & TestIdProps;

export const CurrentAccountDropdown = memo<Props>(({ testID, testIDProperties, isCollectibleScreen }) => {
  const selectedAccount = useSelectedAccountSelector();
  const visibleAccounts = useVisibleAccountsListSelector();

  const dispatch = useDispatch();

  const onValueChange = useCallback(
    (value: AccountBaseInterface | undefined) => dispatch(setSelectedAccountAction(value?.publicKeyHash)),
    []
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
